import React, { createContext, useState, useMemo, useContext, useEffect, useCallback } from 'react';
// FIX: Changed to a type import, which can help with module resolution issues. The error indicates User and Session are not found.
import type { User as AuthUser, Session as AuthSession } from '@supabase/supabase-js';
import { supabase } from '../lib/supabaseClient';
// FIX: Add CreditTransaction to type imports
import { Product, Supplier, PurchaseOrder, StockCount, Branch, StockTransfer, SystemSettings, Tenant, InventoryAdjustmentLog, ScheduledJob, TenantSettings, BlockRule, Staff, TenantRole, Device, Notification, UserSubscription, Customer, Truck, Driver, Consignment, SubscriptionPlan, TenantPermission, ProductVariant, UserRole, Sale, PendingReturnRequest, Invoice, InvoiceTemplate, EmailSmsTemplate, CreditTransaction } from '../types';
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
    // FIX: Import mock data for credit transactions
    creditTransactions as mockCreditTransactions,
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
  recentSales: Sale[];
  setRecentSales: React.Dispatch<React.SetStateAction<Sale[]>>;
  pendingReturns: PendingReturnRequest[];
  setPendingReturns: React.Dispatch<React.SetStateAction<PendingReturnRequest[]>>;
  // FIX: Add creditTransactions to context type
  creditTransactions: CreditTransaction[];
  setCreditTransactions: React.Dispatch<React.SetStateAction<CreditTransaction[]>>;
  invoices: Invoice[];
  setInvoices: React.Dispatch<React.SetStateAction<Invoice[]>>;
  invoiceTemplates: InvoiceTemplate[];
  setInvoiceTemplates: React.Dispatch<React.SetStateAction<InvoiceTemplate[]>>;
  emailSmsTemplates: EmailSmsTemplate[];
  setEmailSmsTemplates: React.Dispatch<React.SetStateAction<EmailSmsTemplate[]>>;
  isImpersonating: boolean;
  stopImpersonating: () => void;
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
    const [isImpersonating, setIsImpersonating] = useState(false);

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
    // FIX: Add state for credit transactions
    const [creditTransactions, setCreditTransactions] = useState<CreditTransaction[]>(mockCreditTransactions);
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
        // This effect runs once on mount to check auth and impersonation status
        const impersonationJson = localStorage.getItem('impersonation_data');
        const hasImpersonation = !!impersonationJson;
        setIsImpersonating(hasImpersonation);
    
        supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
            if (hasImpersonation && currentSession) {
                const parsedData = JSON.parse(impersonationJson!);
                // Construct a fake session object for the impersonated user
                const impersonatedSession: AuthSession = {
                    ...currentSession,
                    user: {
                        ...currentSession.user,
                        id: parsedData.impersonated_user.id,
                        email: parsedData.impersonated_user.email,
                        app_metadata: {
                            ...currentSession.user.app_metadata,
                            ...parsedData.impersonated_user.app_metadata,
                        },
                        user_metadata: {
                            ...currentSession.user.user_metadata,
                            name: parsedData.impersonated_user.name,
                        }
                    } as AuthUser,
                };
                setSession(impersonatedSession);
                setUser(impersonatedSession.user);
            } else {
                setSession(currentSession);
                setUser(currentSession?.user ?? null);
            }
            setLoading(false);
        });
    
        const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
            // If auth state changes (e.g. real logout), drop impersonation
            if (localStorage.getItem('impersonation_data')) {
                localStorage.removeItem('impersonation_data');
                setIsImpersonating(false);
                // Force a reload to clear all state and start fresh
                window.location.reload();
            } else {
                setSession(session);
                setUser(session?.user ?? null);
                setLoading(false);
            }
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
        // onAuthStateChange will handle clearing impersonation and session state
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
                name: staff.name,
                app_metadata: {
                    role: tenantRoles.find(r => r.id === staff.roleId)?.name || 'Cashier'
                }
            }
        };
        localStorage.setItem('impersonation_data', JSON.stringify(impersonationData));
        window.location.reload();
    };

    const stopImpersonating = () => {
        localStorage.removeItem('impersonation_data');
        window.location.reload();
    };


    // Notifications
    const removeNotification = useCallback((id: string) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    }, []);

    const addNotification = useCallback((notification: Omit<Notification, 'id'>) => {
        const id = `notif_${Date.now()}`;
        const newNotification = { ...notification, id };
        setNotifications(prev => [...prev, newNotification]);
        setNotificationHistory(prev => [newNotification, ...prev].slice(0, 20)); // Keep last 20
        setHasUnreadNotifications(true);

        setTimeout(() => {
            removeNotification(id);
        }, notification.duration || 5000);
    }, [removeNotification]);

    // Product save logic
    const saveProduct = useCallback(async (productData: Product) => {
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
    }, [products, addNotification]);


    // Permissions
    const currentUserPermissions = useMemo(() => {
        if (!session || !tenantRoles) return new Set<TenantPermission>();
        const userRoleName = session.user?.app_metadata?.role;
        const role = tenantRoles.find(r => r.name === userRoleName);
        return new Set(role?.permissions || []);
    }, [session, tenantRoles]);

    const markNotificationsAsRead = () => {
        setHasUnreadNotifications(false);
    };

    const value: AppContextType = {
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
        // FIX: Provide credit transactions state in context
        creditTransactions, setCreditTransactions,
        invoices, setInvoices,
        invoiceTemplates, setInvoiceTemplates,
        emailSmsTemplates, setEmailSmsTemplates,
        isImpersonating,
        stopImpersonating,
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};
