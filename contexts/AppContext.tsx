import React, { createContext, useState, useMemo, useContext, useEffect, useCallback } from 'react';
// FIX: Changed to a type import, which can help with module resolution issues. The error indicates User and Session are not found.
import type { User as AuthUser, Session as AuthSession } from '@supabase/supabase-js';
import { supabase } from '../lib/supabaseClient';
import { User, Session, Product, Supplier, PurchaseOrder, StockCount, Branch, StockTransfer, SystemSettings, Tenant, InventoryAdjustmentLog, ScheduledJob, TenantSettings, BlockRule, Staff, TenantRole, Device, Notification, UserSubscription, Customer, Truck, Driver, Consignment, SubscriptionPlan, TenantPermission, ProductVariant, UserRole, Sale, PendingReturnRequest, Invoice, InvoiceTemplate, EmailSmsTemplate } from '../types';
import { 
    systemSettings as mockSettingsData, 
    invoices as mockInvoices,
    userSubscription as mockUserSubscription,
    subscriptionPlans as mockSubscriptionPlans,
    posProducts as mockProducts,
    suppliers as mockSuppliers,
    purchaseOrders as mockPurchaseOrders,
    stockCounts as mockStockCounts,
    branches as mockBranches,
    stockTransfers as mockStockTransfers,
    inventoryAdjustmentLogs as mockInventoryAdjustmentLogs,
    scheduledJobs as mockScheduledJobs,
    tenantSettings as mockTenantSettings,
    blockRules as mockBlockRules,
    staff as mockStaff,
    tenantRoles as mockTenantRoles,
    approvedDevices as mockApprovedDevices,
    pendingDevices as mockPendingDevices,
    customers as mockCustomers,
    trucks as mockTrucks,
    drivers as mockDrivers,
    consignments as mockConsignments,
    recentSales as mockRecentSales,
    invoiceTemplates as mockInvoiceTemplates,
    emailSmsTemplates as mockEmailSmsTemplates,
} from '../data/mockData';


export type Language = 'en' | 'es' | 'fr';
export type Currency = 'USD' | 'EUR' | 'NGN';

// New Type for Notification Preferences
export interface NotificationPrefs {
    salesEmail: boolean;
    salesPush: boolean;
    refundsEmail: boolean;
    lowStockEmail: boolean;
    lowStockSms: boolean;
    outOfStockEmail: boolean;
    creditReminderEmail: boolean;
}

// FIX: Added missing AppContextType interface definition
interface AppContextType {
  session: AuthSession | null;
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<{ data: { session: AuthSession | null }, error: any | null }>;
  logout: () => Promise<void>;
  language: Language;
  setLanguage: React.Dispatch<React.SetStateAction<Language>>;
  currency: Currency;
  setCurrency: React.Dispatch<React.SetStateAction<Currency>>;
  notificationPrefs: NotificationPrefs;
  setNotificationPrefs: React.Dispatch<React.SetStateAction<NotificationPrefs>>;
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  saveProduct: (productData: Product) => Promise<void>;
  suppliers: Supplier[];
  setSuppliers: React.Dispatch<React.SetStateAction<Supplier[]>>;
  purchaseOrders: PurchaseOrder[];
  setPurchaseOrders: React.Dispatch<React.SetStateAction<PurchaseOrder[]>>;
  stockCounts: StockCount[];
  setStockCounts: React.Dispatch<React.SetStateAction<StockCount[]>>;
  branches: Branch[];
  setBranches: React.Dispatch<React.SetStateAction<Branch[]>>;
  currentBranchId: string;
  setCurrentBranchId: (branchId: string) => void;
  stockTransfers: StockTransfer[];
  setStockTransfers: React.Dispatch<React.SetStateAction<StockTransfer[]>>;
  inventoryAdjustmentLogs: InventoryAdjustmentLog[];
  setInventoryAdjustmentLogs: React.Dispatch<React.SetStateAction<InventoryAdjustmentLog[]>>;
  scheduledJobs: ScheduledJob[];
  setScheduledJobs: React.Dispatch<React.SetStateAction<ScheduledJob[]>>;
  settings: SystemSettings | null;
  setSettings: React.Dispatch<React.SetStateAction<SystemSettings | null>>;
  tenantSettings: TenantSettings | null;
  setTenantSettings: React.Dispatch<React.SetStateAction<TenantSettings | null>>;
  blockRules: BlockRule[];
  setBlockRules: React.Dispatch<React.SetStateAction<BlockRule[]>>;
  staff: Staff[];
  setStaff: React.Dispatch<React.SetStateAction<Staff[]>>;
  tenantRoles: TenantRole[];
  setTenantRoles: React.Dispatch<React.SetStateAction<TenantRole[]>>;
  currentUserPermissions: Set<TenantPermission>;
  approvedDevices: Device[];
  setApprovedDevices: React.Dispatch<React.SetStateAction<Device[]>>;
  pendingDevices: Device[];
  setPendingDevices: React.Dispatch<React.SetStateAction<Device[]>>;
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  removeNotification: (id: string) => void;
  notificationHistory: Notification[];
  userSubscription: UserSubscription | null;
  setUserSubscription: React.Dispatch<React.SetStateAction<UserSubscription | null>>;
  subscriptionPlans: SubscriptionPlan[];
  setSubscriptionPlans: React.Dispatch<React.SetStateAction<SubscriptionPlan[]>>;
  markNotificationsAsRead: () => void;
  hasUnreadNotifications: boolean;
  customers: Customer[];
  setCustomers: React.Dispatch<React.SetStateAction<Customer[]>>;
  trucks: Truck[];
  setTrucks: React.Dispatch<React.SetStateAction<Truck[]>>;
  drivers: Driver[];
  setDrivers: React.Dispatch<React.SetStateAction<Driver[]>>;
  consignments: Consignment[];
  setConsignments: React.Dispatch<React.SetStateAction<Consignment[]>>;
  impersonateStaff: (staff: Staff, navigate: (path: string, options?: { replace?: boolean }) => void) => void;
  // FIX: Add recentSales to context to make it available to DashboardPage and other components
  recentSales: Sale[];
  setRecentSales: React.Dispatch<React.SetStateAction<Sale[]>>;
  pendingReturns: PendingReturnRequest[];
  setPendingReturns: React.Dispatch<React.SetStateAction<PendingReturnRequest[]>>;
  invoices: Invoice[];
  setInvoices: React.Dispatch<React.SetStateAction<Invoice[]>>;
  invoiceTemplates: InvoiceTemplate[];
  setInvoiceTemplates: React.Dispatch<React.SetStateAction<InvoiceTemplate[]>>;
  emailSmsTemplates: EmailSmsTemplate[];
  setEmailSmsTemplates: React.Dispatch<React.SetStateAction<EmailSmsTemplate[]>>;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [session, setSession] = useState<AuthSession | null>(null);
    const [user, setUser] = useState<AuthUser | null>(null);
    const [loading, setLoading] = useState(true);

    const [language, setLanguage] = useState<Language>('en');
    const [currency, setCurrency] = useState<Currency>('USD');
    const [notificationPrefs, setNotificationPrefs] = useState<NotificationPrefs>({
        salesEmail: true, salesPush: false, refundsEmail: true,
        lowStockEmail: true, lowStockSms: false, outOfStockEmail: false,
        creditReminderEmail: true
    });

    const [products, setProducts] = useState<Product[]>(mockProducts);
    const [suppliers, setSuppliers] = useState<Supplier[]>(mockSuppliers);
    const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(mockPurchaseOrders);
    const [stockCounts, setStockCounts] = useState<StockCount[]>(mockStockCounts);
    const [branches, setBranches] = useState<Branch[]>(mockBranches);
    const [currentBranchId, _setCurrentBranchId] = useState<string>(mockBranches[0]?.id || '');
    const [stockTransfers, setStockTransfers] = useState<StockTransfer[]>(mockStockTransfers);
    const [inventoryAdjustmentLogs, setInventoryAdjustmentLogs] = useState<InventoryAdjustmentLog[]>(mockInventoryAdjustmentLogs);
    const [scheduledJobs, setScheduledJobs] = useState<ScheduledJob[]>(mockScheduledJobs);
    const [settings, setSettings] = useState<SystemSettings | null>(mockSettingsData);
    const [tenantSettings, setTenantSettings] = useState<TenantSettings | null>(mockTenantSettings);
    const [blockRules, setBlockRules] = useState<BlockRule[]>(mockBlockRules);
    const [staff, setStaff] = useState<Staff[]>(mockStaff);
    const [tenantRoles, setTenantRoles] = useState<TenantRole[]>(mockTenantRoles);
    const [approvedDevices, setApprovedDevices] = useState<Device[]>(mockApprovedDevices);
    const [pendingDevices, setPendingDevices] = useState<Device[]>(mockPendingDevices);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [notificationHistory, setNotificationHistory] = useState<Notification[]>([]);
    const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);
    const [userSubscription, setUserSubscription] = useState<UserSubscription | null>(mockUserSubscription);
    const [subscriptionPlans, setSubscriptionPlans] = useState<SubscriptionPlan[]>(mockSubscriptionPlans);
    const [customers, setCustomers] = useState<Customer[]>(mockCustomers);
    const [trucks, setTrucks] = useState<Truck[]>(mockTrucks);
    const [drivers, setDrivers] = useState<Driver[]>(mockDrivers);
    const [consignments, setConsignments] = useState<Consignment[]>(mockConsignments);
    const [recentSales, setRecentSales] = useState<Sale[]>(mockRecentSales);
    const [pendingReturns, setPendingReturns] = useState<PendingReturnRequest[]>([]);
    const [invoices, setInvoices] = useState<Invoice[]>(mockInvoices);
    const [emailSmsTemplates, setEmailSmsTemplates] = useState<EmailSmsTemplate[]>(mockEmailSmsTemplates);
    const [invoiceTemplates, setInvoiceTemplates] = useState<InvoiceTemplate[]>(mockInvoiceTemplates);
    

    const setCurrentBranchId = (branchId: string) => {
        localStorage.setItem('currentBranchId', branchId);
        _setCurrentBranchId(branchId);
    };

    useEffect(() => {
        const savedBranchId = localStorage.getItem('currentBranchId');
        if (savedBranchId && branches.some(b => b.id === savedBranchId)) {
            _setCurrentBranchId(savedBranchId);
        }
    }, [branches]);

    // Supabase Auth
    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session)
            setUser(session?.user ?? null)
            setLoading(false)
        })

        const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);
        });

        return () => {
            authListener.subscription.unsubscribe();
        };
    }, []);

    const login = async (email: string, pass: string) => {
        // FIX: Use signInWithPassword which is the correct v2 method
        return supabase.auth.signInWithPassword({ email, password: pass });
    };

    const logout = async () => {
        // FIX: Use signOut which is the correct v2 method
        await supabase.auth.signOut();
        // Clear impersonation on logout
        localStorage.removeItem('impersonation_data');
    };

     const impersonateStaff = (staff: Staff, navigate: (path: string, options?: { replace?: boolean }) => void) => {
        if (!session) return;
        const impersonationData = {
            original_user: {
                id: session.user.id,
                email: session.user.email,
                app_metadata: session.user.app_metadata
            },
            impersonated_user: {
                id: staff.id,
                email: staff.email,
                app_metadata: {
                    ...session.user.app_metadata, // Keep tenant_id
                    role: tenantRoles.find(r => r.id === staff.roleId)?.name || 'Cashier'
                }
            }
        };
        localStorage.setItem('impersonation_data', JSON.stringify(impersonationData));
        window.location.reload();
    };

    // Product save logic
    const saveProduct = async (productData: Product) => {
        const existingIndex = products.findIndex(p => p.id === productData.id);
        if (existingIndex > -1) {
            setProducts(currentProducts => {
                const updatedProducts = [...currentProducts];
                updatedProducts[existingIndex] = productData;
                return updatedProducts;
            });
            addNotification({ message: 'Product updated successfully.', type: 'success' });
        } else {
            setProducts(currentProducts => [productData, ...currentProducts]);
            addNotification({ message: 'Product added successfully.', type: 'success' });
        }
    };

    // Permissions
    const currentUserPermissions = useMemo(() => {
        if (!session || !tenantRoles) return new Set<TenantPermission>();
        const userRoleName = session.user?.app_metadata?.role;
        const role = tenantRoles.find(r => r.name === userRoleName);
        return new Set(role?.permissions || []);
    }, [session, tenantRoles]);

    // Notifications
    const addNotification = useCallback((notification: Omit<Notification, 'id'>) => {
        const id = `notif_${Date.now()}`;
        const newNotification = { ...notification, id };
        setNotifications(prev => [...prev, newNotification]);
        setNotificationHistory(prev => [newNotification, ...prev].slice(0, 20)); // Keep last 20
        setHasUnreadNotifications(true);

        setTimeout(() => {
            removeNotification(id);
        }, notification.duration || 5000);
    }, []);

    const removeNotification = (id: string) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    const markNotificationsAsRead = () => {
        setHasUnreadNotifications(false);
    };

    const value = {
        session,
        user,
        loading,
        login,
        logout,
        language, setLanguage,
        currency, setCurrency,
        notificationPrefs, setNotificationPrefs,
        products, setProducts,
        saveProduct,
        suppliers, setSuppliers,
        purchaseOrders, setPurchaseOrders,
        stockCounts, setStockCounts,
        branches, setBranches,
        currentBranchId, setCurrentBranchId,
        stockTransfers, setStockTransfers,
        inventoryAdjustmentLogs, setInventoryAdjustmentLogs,
        scheduledJobs, setScheduledJobs,
        settings, setSettings,
        tenantSettings, setTenantSettings,
        blockRules, setBlockRules,
        staff, setStaff,
        tenantRoles, setTenantRoles,
        currentUserPermissions,
        approvedDevices, setApprovedDevices,
        pendingDevices, setPendingDevices,
        notifications, addNotification, removeNotification, notificationHistory,
        userSubscription, setUserSubscription,
        subscriptionPlans, setSubscriptionPlans,
        markNotificationsAsRead, hasUnreadNotifications,
        customers, setCustomers,
        trucks, setTrucks,
        drivers, setDrivers,
        consignments, setConsignments,
        impersonateStaff,
        recentSales, setRecentSales,
        pendingReturns, setPendingReturns,
        invoices, setInvoices,
        invoiceTemplates, setInvoiceTemplates,
        emailSmsTemplates, setEmailSmsTemplates,
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};
