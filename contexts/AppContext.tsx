import React, { createContext, useState, useMemo, useContext, useEffect, useCallback } from 'react';
import { User as AuthUser, Session as AuthSession } from '@supabase/supabase-js';
import { supabase } from '../lib/supabaseClient';
import { User, Session, Product, Supplier, PurchaseOrder, StockCount, Branch, StockTransfer, SystemSettings, Tenant, InventoryAdjustmentLog, ScheduledJob, TenantSettings, BlockRule, Staff, TenantRole, Device, Notification, UserSubscription, Customer, Truck, Driver, Consignment, SubscriptionPlan, TenantPermission, ProductVariant, UserRole, Sale, PendingReturnRequest, Invoice } from '../types';
import { 
    systemSettings as mockSettingsData, 
    invoices as mockInvoices,
    userSubscription as mockUserSubscription,
    subscriptionPlans as mockSubscriptionPlans 
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
}


const defaultNotificationPrefs: NotificationPrefs = {
    salesEmail: true,
    salesPush: true,
    refundsEmail: true,
    lowStockEmail: true,
    lowStockSms: false,
    outOfStockEmail: true,
    creditReminderEmail: true,
};

export const AppContext = createContext<AppContextType>({} as AppContextType);


export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Auth state from Supabase
  const [session, setSession] = useState<AuthSession | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Data states, initialized as empty, to be filled from Supabase
  const [products, setProducts] = useState<Product[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [stockCounts, setStockCounts] = useState<StockCount[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [stockTransfers, setStockTransfers] = useState<StockTransfer[]>([]);
  const [inventoryAdjustmentLogs, setInventoryAdjustmentLogs] = useState<InventoryAdjustmentLog[]>([]);
  const [scheduledJobs, setScheduledJobs] = useState<ScheduledJob[]>([]);
  const [settings, setSettings] = useState<SystemSettings | null>(mockSettingsData); // System settings can be mock for now
  const [tenantSettings, setTenantSettings] = useState<TenantSettings | null>(null);
  const [blockRules, setBlockRules] = useState<BlockRule[]>([]);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [tenantRoles, setTenantRoles] = useState<TenantRole[]>([]);
  const [approvedDevices, setApprovedDevices] = useState<Device[]>([]);
  const [pendingDevices, setPendingDevices] = useState<Device[]>([]);
  const [userSubscription, setUserSubscription] = useState<UserSubscription | null>(mockUserSubscription);
  const [subscriptionPlans, setSubscriptionPlans] = useState<SubscriptionPlan[]>(mockSubscriptionPlans);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [trucks, setTrucks] = useState<Truck[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [consignments, setConsignments] = useState<Consignment[]>([]);
  const [recentSales, setRecentSales] = useState<Sale[]>([]);
  const [pendingReturns, setPendingReturns] = useState<PendingReturnRequest[]>([]);
  // FIX: Add invoices to context
  const [invoices, setInvoices] = useState<Invoice[]>(mockInvoices);

  // Local preferences
  const [language, setLanguage] = useState<Language>('en');
  const [currency, setCurrency] = useState<Currency>('USD');
  const [notificationPrefs, setNotificationPrefs] = useState<NotificationPrefs>(defaultNotificationPrefs);
  const [currentBranchId, _setCurrentBranchId] = useState<string>('br_1');

  // Notifications
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [notificationHistory, setNotificationHistory] = useState<Notification[]>([]);
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);

  // Supabase Auth listener
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
    });

    const checkSession = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
    };
    checkSession();

    return () => subscription.unsubscribe();
  }, []);
  
  // Data Fetching based on session
  const fetchAllData = useCallback(async () => {
    // In a real app, you might fetch these in parallel with Promise.all
    console.log("Fetching all data from Supabase...");
    
    // NOTE: This assumes Row Level Security is set up in Supabase
    // to only return data for the currently authenticated user's tenant.
    // The table names are assumed to be snake_case.

    const { data: productsData } = await supabase.from('products').select('*, variants:product_variants(*)');
    setProducts((productsData as any) || []);
    
    // Fetch other data... (examples)
    const { data: branchesData } = await supabase.from('branches').select('*');
    setBranches((branchesData as any) || []);

    const { data: staffData } = await supabase.from('staff').select('*');
    setStaff((staffData as any) || []);

    const { data: rolesData } = await supabase.from('tenant_roles').select('*');
    setTenantRoles((rolesData as any) || []);

    const { data: salesData } = await supabase.from('sales').select('*, items:sale_items(*)');
    setRecentSales((salesData as any) || []);

     // Add other fetch calls here for suppliers, customers, etc.
     // For brevity in this example, only a few are shown.
  }, []);

  useEffect(() => {
    if (session) {
        fetchAllData();
    } else {
        // Clear data on logout
        setProducts([]);
        setBranches([]);
        setStaff([]);
        setTenantRoles([]);
        setRecentSales([]);
        setUserSubscription(null);
        setSubscriptionPlans([]);
        // Clear other states...
    }
  }, [session, fetchAllData]);

  const login = async (email: string, pass: string) => {
    // FIX: The parameter is `pass`, but the property name expected by signInWithPassword is `password`.
    return await supabase.auth.signInWithPassword({ email, password: pass });
  };

  const logout = async () => {
    await supabase.auth.signOut();
  };

  // Example of a mutation function that writes to Supabase
  const saveProduct = async (productData: Product) => {
    // This is a simplified example. A real implementation would handle errors,
    // transactions, and relationships more robustly.
    const { id, variants, isFavorite, variantOptions, ...productFields } = productData;
    
    // 1. Upsert the main product
    const { data: savedProduct, error: productError } = await supabase
        .from('products')
        .upsert({ id, is_favorite: isFavorite, ...productFields })
        .select()
        .single();
    
    if (productError) {
        addNotification({ message: `Error saving product: ${productError.message}`, type: 'error' });
        return;
    }

    // 2. Upsert variants
    const variantsToSave = variants.map(v => ({
        id: v.id.startsWith('new_') ? undefined : v.id,
        product_id: savedProduct.id,
        sku: v.sku,
        price: v.price,
        cost_price: v.costPrice,
        stock_by_branch: v.stockByBranch,
        low_stock_threshold: v.lowStockThreshold,
        options: v.options,
    }));
    
    const { error: variantsError } = await supabase.from('product_variants').upsert(variantsToSave);

    if (variantsError) {
        addNotification({ message: `Error saving variants: ${variantsError.message}`, type: 'error' });
        return;
    }
    
    addNotification({ message: 'Product saved successfully!', type: 'success' });
    // Refetch data to update UI
    await fetchAllData();
  };
  
  // Keep other setters for now to avoid breaking the app, but add TODOs
  // In a real app, each of these would become specific mutation functions like saveProduct.
  // TODO: Convert all `set...` functions below to call Supabase instead of just updating local state.
  
  const currentUserPermissions = useMemo(() => {
    const roleName = session?.user?.app_metadata?.role;
    if (roleName && tenantRoles.length > 0) {
        const role = tenantRoles.find(r => r.name === roleName);
        if (role) {
            return new Set(role.permissions as TenantPermission[]);
        }
    }
    return new Set<TenantPermission>();
  }, [session, tenantRoles]);

  const addNotification = (notification: Omit<Notification, 'id'>) => {
    const id = `notif_${Date.now()}`;
    const newNotification = { id, ...notification };
    setNotifications(prev => [...prev, newNotification]);
    setNotificationHistory(prev => [newNotification, ...prev].slice(0, 20));
    setHasUnreadNotifications(true);
    const duration = notification.duration || 5000;
    setTimeout(() => removeNotification(id), duration);
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };
  
  const setCurrentBranchId = (branchId: string) => {
    // TODO: Persist this preference in Supabase user_profile table.
    _setCurrentBranchId(branchId);
  };

  const markNotificationsAsRead = () => {
    setHasUnreadNotifications(false);
  };
  
  const impersonateStaff = useCallback((staff: Staff, navigate: (path: string, options?: { replace?: boolean }) => void) => {
    // This functionality would require a secure backend implementation and is mocked here.
    alert(`Impersonation is a backend feature. Simulating login for ${staff.name}.`);
    navigate('/app/dashboard', { replace: true });
  }, []);

  const value = {
      session, user, loading, login, logout, language, setLanguage, currency, setCurrency,
      notificationPrefs, setNotificationPrefs, products, setProducts, saveProduct, suppliers, setSuppliers,
      purchaseOrders, setPurchaseOrders, stockCounts, setStockCounts, branches, setBranches,
      currentBranchId, setCurrentBranchId, stockTransfers, setStockTransfers, inventoryAdjustmentLogs,
      setInventoryAdjustmentLogs, scheduledJobs, setScheduledJobs, settings, setSettings,
      tenantSettings, setTenantSettings, blockRules, setBlockRules, staff, setStaff, tenantRoles,
      setTenantRoles, currentUserPermissions, approvedDevices, setApprovedDevices, pendingDevices,
      setPendingDevices, notifications, addNotification, removeNotification, notificationHistory,
      markNotificationsAsRead, userSubscription, setUserSubscription, subscriptionPlans, setSubscriptionPlans,
      hasUnreadNotifications, customers, setCustomers, trucks, setTrucks, drivers, setDrivers,
      consignments, setConsignments, impersonateStaff, recentSales, setRecentSales, pendingReturns, setPendingReturns,
      invoices, setInvoices,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
}