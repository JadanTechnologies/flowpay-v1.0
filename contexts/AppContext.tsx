





import React, { createContext, useState, useMemo, useContext, useEffect, useCallback } from 'react';
import { User, Session, Product, Supplier, PurchaseOrder, StockCount, Branch, StockTransfer, SystemSettings, Tenant, InventoryAdjustmentLog, ScheduledJob, TenantSettings, BlockRule, Staff, TenantRole, Device, Notification, UserSubscription, Customer, Truck, Driver, Consignment, SubscriptionPlan, TenantPermission, ProductVariant, UserRole } from '../types';
import { posProducts as mockProducts, suppliers as mockSuppliers, purchaseOrders as mockPurchaseOrders, stockCounts as mockStockCounts, branches as mockBranches, stockTransfers as mockStockTransfers, systemSettings as mockSettingsData, inventoryAdjustmentLogs as mockInventoryAdjustmentLogs, scheduledJobs as mockScheduledJobs, tenantSettings as mockTenantSettings, blockRules as mockBlockRules, tenantRoles as mockTenantRoles, approvedDevices as mockApprovedDevices, pendingDevices as mockPendingDevices, userSubscription as mockUserSubscription, customers as mockCustomers, trucks as mockTrucks, drivers as mockDrivers, consignments as mockConsignments, subscriptionPlans as mockPlans, staff as mockStaffData } from '../data/mockData';


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
}

// FIX: Added missing AppContextType interface definition
interface AppContextType {
  isMaintenanceMode: boolean;
  setMaintenanceMode: React.Dispatch<React.SetStateAction<boolean>>;
  maintenanceMessage: string;
  setMaintenanceMessage: React.Dispatch<React.SetStateAction<string>>;
  session: Session | null;
  user: User | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<{ data: { session: Session | null }, error: Error | null }>;
  logout: () => Promise<void>;
  language: Language;
  setLanguage: React.Dispatch<React.SetStateAction<Language>>;
  currency: Currency;
  setCurrency: React.Dispatch<React.SetStateAction<Currency>>;
  notificationPrefs: NotificationPrefs;
  setNotificationPrefs: React.Dispatch<React.SetStateAction<NotificationPrefs>>;
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  suppliers: Supplier[];
  setSuppliers: React.Dispatch<React.SetStateAction<Supplier[]>>;
  purchaseOrders: PurchaseOrder[];
  setPurchaseOrders: React.Dispatch<React.SetStateAction<PurchaseOrder[]>>;
  stockCounts: StockCount[];
  setStockCounts: React.Dispatch<React.SetStateAction<StockCount[]>>;
  branches: Branch[];
  setBranches: React.Dispatch<React.SetStateAction<Branch[]>>;
  currentBranchId: string;
  setCurrentBranchId: React.Dispatch<React.SetStateAction<string>>;
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
}


const defaultNotificationPrefs: NotificationPrefs = {
    salesEmail: true,
    salesPush: true,
    refundsEmail: true,
    lowStockEmail: true,
    lowStockSms: false,
    outOfStockEmail: true,
};

export const AppContext = createContext<AppContextType>({} as AppContextType);

function getInitialState<T>(key: string, defaultValue: T): T {
  try {
    const saved = localStorage.getItem(key);
    if (saved !== null) {
      return JSON.parse(saved);
    }
  } catch (error) {
    console.error(`Error parsing localStorage key "${key}":`, error);
  }
  // If we reach here, there was no valid saved data. Use default and save it.
  localStorage.setItem(key, JSON.stringify(defaultValue));
  return defaultValue;
}


export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Use local storage for state persistence
  const [products, setProducts] = useState<Product[]>(() => getInitialState('flowpay_products', mockProducts));
  const [suppliers, setSuppliers] = useState<Supplier[]>(() => getInitialState('flowpay_suppliers', mockSuppliers));
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(() => getInitialState('flowpay_purchaseOrders', mockPurchaseOrders));
  const [stockCounts, setStockCounts] = useState<StockCount[]>(() => getInitialState('flowpay_stockCounts', mockStockCounts));
  const [branches, setBranches] = useState<Branch[]>(() => getInitialState('flowpay_branches', mockBranches));
  const [stockTransfers, setStockTransfers] = useState<StockTransfer[]>(() => getInitialState('flowpay_stockTransfers', mockStockTransfers));
  const [inventoryAdjustmentLogs, setInventoryAdjustmentLogs] = useState<InventoryAdjustmentLog[]>(() => getInitialState('flowpay_inventoryAdjustmentLogs', mockInventoryAdjustmentLogs));
  const [scheduledJobs, setScheduledJobs] = useState<ScheduledJob[]>(() => getInitialState('flowpay_scheduledJobs', mockScheduledJobs));
  const [settings, setSettings] = useState<SystemSettings | null>(() => getInitialState('flowpay_settings', mockSettingsData));
  const [tenantSettings, setTenantSettings] = useState<TenantSettings | null>(() => getInitialState('flowpay_tenantSettings', mockTenantSettings));
  const [blockRules, setBlockRules] = useState<BlockRule[]>(() => getInitialState('flowpay_blockRules', mockBlockRules));
  const [staff, setStaff] = useState<Staff[]>(() => getInitialState('flowpay_staff', mockStaffData));
  const [tenantRoles, setTenantRoles] = useState<TenantRole[]>(() => getInitialState('flowpay_tenantRoles', mockTenantRoles));
  const [approvedDevices, setApprovedDevices] = useState<Device[]>(() => getInitialState('flowpay_approvedDevices', mockApprovedDevices));
  const [pendingDevices, setPendingDevices] = useState<Device[]>(() => getInitialState('flowpay_pendingDevices', mockPendingDevices));
  const [userSubscription, setUserSubscription] = useState<UserSubscription | null>(() => getInitialState('flowpay_userSubscription', mockUserSubscription));
  const [subscriptionPlans, setSubscriptionPlans] = useState<SubscriptionPlan[]>(() => getInitialState('flowpay_subscriptionPlans', mockPlans));
  const [customers, setCustomers] = useState<Customer[]>(() => getInitialState('flowpay_customers', mockCustomers));
  const [trucks, setTrucks] = useState<Truck[]>(() => getInitialState('flowpay_trucks', mockTrucks));
  const [drivers, setDrivers] = useState<Driver[]>(() => getInitialState('flowpay_drivers', mockDrivers));
  const [consignments, setConsignments] = useState<Consignment[]>(() => getInitialState('flowpay_consignments', mockConsignments));

  const [language, setLanguage] = useState<Language>(() => getInitialState('flowpay_language', 'en'));
  const [currency, setCurrency] = useState<Currency>(() => getInitialState('flowpay_currency', 'USD'));
  const [notificationPrefs, setNotificationPrefs] = useState<NotificationPrefs>(() => getInitialState('flowpay_notificationPrefs', defaultNotificationPrefs));
  const [currentBranchId, setCurrentBranchId] = useState<string>(() => getInitialState('flowpay_currentBranchId', 'br_1'));
  const [isMaintenanceMode, setMaintenanceMode] = useState<boolean>(() => getInitialState('flowpay_isMaintenanceMode', false));
  const [maintenanceMessage, setMaintenanceMessage] = useState<string>(() => getInitialState('flowpay_maintenanceMessage', "We are currently undergoing scheduled maintenance. We'll be back shortly."));

  // Auto-save to localStorage on change
  useEffect(() => { localStorage.setItem('flowpay_products', JSON.stringify(products)); }, [products]);
  useEffect(() => { localStorage.setItem('flowpay_suppliers', JSON.stringify(suppliers)); }, [suppliers]);
  useEffect(() => { localStorage.setItem('flowpay_purchaseOrders', JSON.stringify(purchaseOrders)); }, [purchaseOrders]);
  useEffect(() => { localStorage.setItem('flowpay_stockCounts', JSON.stringify(stockCounts)); }, [stockCounts]);
  useEffect(() => { localStorage.setItem('flowpay_branches', JSON.stringify(branches)); }, [branches]);
  useEffect(() => { localStorage.setItem('flowpay_stockTransfers', JSON.stringify(stockTransfers)); }, [stockTransfers]);
  useEffect(() => { localStorage.setItem('flowpay_inventoryAdjustmentLogs', JSON.stringify(inventoryAdjustmentLogs)); }, [inventoryAdjustmentLogs]);
  useEffect(() => { localStorage.setItem('flowpay_scheduledJobs', JSON.stringify(scheduledJobs)); }, [scheduledJobs]);
  useEffect(() => { localStorage.setItem('flowpay_settings', JSON.stringify(settings)); }, [settings]);
  useEffect(() => { localStorage.setItem('flowpay_tenantSettings', JSON.stringify(tenantSettings)); }, [tenantSettings]);
  useEffect(() => { localStorage.setItem('flowpay_blockRules', JSON.stringify(blockRules)); }, [blockRules]);
  useEffect(() => { localStorage.setItem('flowpay_staff', JSON.stringify(staff)); }, [staff]);
  useEffect(() => { localStorage.setItem('flowpay_tenantRoles', JSON.stringify(tenantRoles)); }, [tenantRoles]);
  useEffect(() => { localStorage.setItem('flowpay_approvedDevices', JSON.stringify(approvedDevices)); }, [approvedDevices]);
  useEffect(() => { localStorage.setItem('flowpay_pendingDevices', JSON.stringify(pendingDevices)); }, [pendingDevices]);
  useEffect(() => { localStorage.setItem('flowpay_userSubscription', JSON.stringify(userSubscription)); }, [userSubscription]);
  useEffect(() => { localStorage.setItem('flowpay_subscriptionPlans', JSON.stringify(subscriptionPlans)); }, [subscriptionPlans]);
  useEffect(() => { localStorage.setItem('flowpay_customers', JSON.stringify(customers)); }, [customers]);
  useEffect(() => { localStorage.setItem('flowpay_trucks', JSON.stringify(trucks)); }, [trucks]);
  useEffect(() => { localStorage.setItem('flowpay_drivers', JSON.stringify(drivers)); }, [drivers]);
  useEffect(() => { localStorage.setItem('flowpay_consignments', JSON.stringify(consignments)); }, [consignments]);
  useEffect(() => { localStorage.setItem('flowpay_language', JSON.stringify(language)); }, [language]);
  useEffect(() => { localStorage.setItem('flowpay_currency', JSON.stringify(currency)); }, [currency]);
  useEffect(() => { localStorage.setItem('flowpay_notificationPrefs', JSON.stringify(notificationPrefs)); }, [notificationPrefs]);
  useEffect(() => { localStorage.setItem('flowpay_currentBranchId', JSON.stringify(currentBranchId)); }, [currentBranchId]);
  useEffect(() => { localStorage.setItem('flowpay_isMaintenanceMode', JSON.stringify(isMaintenanceMode)); }, [isMaintenanceMode]);
  useEffect(() => { localStorage.setItem('flowpay_maintenanceMessage', JSON.stringify(maintenanceMessage)); }, [maintenanceMessage]);
  
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [currentUserPermissions, setCurrentUserPermissions] = useState<Set<TenantPermission>>(new Set());

  // Notification State
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [notificationHistory, setNotificationHistory] = useState<Notification[]>([]);
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);

  useEffect(() => {
    const initializeApp = async () => {
        setLoading(true);
        const token = localStorage.getItem('flowpay_token');
        if (token) {
            try {
                const storedUser = localStorage.getItem('flowpay_user');
                if(storedUser) {
                    const parsedUser: User = JSON.parse(storedUser);
                    const mockSession: Session = { access_token: token, token_type: 'bearer', user: parsedUser };
                    setSession(mockSession);
                    setUser(parsedUser);
                } else {
                    localStorage.removeItem('flowpay_token');
                }
            } catch (e) {
                 console.error("Failed to parse user session from localStorage", e);
                 localStorage.removeItem('flowpay_token');
                 localStorage.removeItem('flowpay_user');
            }
        }
        setLoading(false);
    };

    initializeApp();
  }, []);

  // Effect to calculate user permissions
  useEffect(() => {
    if (session?.user && staff.length > 0 && tenantRoles.length > 0) {
        const userEmail = session.user.email;
        const staffMember = staff.find(s => s.email === userEmail);
        
        if (staffMember) {
            const role = tenantRoles.find(r => r.id === staffMember.roleId);
            if (role) setCurrentUserPermissions(new Set(role.permissions as TenantPermission[]));
        } else if (session.user.role === 'Admin') {
            const adminRole = tenantRoles.find(r => r.name === 'Admin');
            if (adminRole) setCurrentUserPermissions(new Set(adminRole.permissions as TenantPermission[]));
        }
    } else {
        setCurrentUserPermissions(new Set());
    }
  }, [session, staff, tenantRoles]);

  
  const login = async (email: string, pass: string): Promise<{ data: { session: Session | null }, error: Error | null }> => {
    // This is a mock login function.
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay

    if (pass !== '12345') { // Mock password for all users
        const error = new Error("Invalid credentials.");
        return { data: { session: null }, error };
    }

    let loggedInUser: User | null = null;
    if (email === 'superadmin@flowpay.com') {
        loggedInUser = {
            id: 'sa_1',
            email: 'superadmin@flowpay.com',
            name: 'Super Admin',
            role: 'super_admin'
        };
    } else {
        const staffMember = staff.find(s => s.email === email);
        if (staffMember) {
            const role = tenantRoles.find(r => r.id === staffMember.roleId);
            loggedInUser = {
                id: staffMember.id,
                email: staffMember.email,
                name: staffMember.name,
                role: (role?.name as UserRole) || 'Cashier',
                tenantId: 'tnt_2' // Mock tenant ID
            };
        }
    }

    if (!loggedInUser) {
        const error = new Error("User not found.");
        return { data: { session: null }, error };
    }
    
    const token = `mock_token_${Date.now()}`;
    localStorage.setItem('flowpay_token', token);
    localStorage.setItem('flowpay_user', JSON.stringify(loggedInUser));

    const newSession: Session = {
        access_token: token,
        token_type: 'bearer',
        user: loggedInUser,
    };
    
    setSession(newSession);
    setUser(loggedInUser);
    
    return { data: { session: newSession }, error: null };
  };

  const logout = async () => {
    localStorage.removeItem('flowpay_token');
    localStorage.removeItem('flowpay_user');
    setSession(null);
    setUser(null);
  };
  
  const playSound = () => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      gainNode.gain.setValueAtTime(0.05, audioContext.currentTime);
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.1);
    } catch (e) {
      console.error("Could not play notification sound.", e);
    }
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const addNotification = (notification: Omit<Notification, 'id'>) => {
    const id = `notif_${Date.now()}`;
    const newNotification = { id, ...notification };
    setNotifications(prev => [...prev, newNotification]);
    setNotificationHistory(prev => [newNotification, ...prev].slice(0, 20)); // Keep last 20
    setHasUnreadNotifications(true);
    playSound();
    const duration = notification.duration || 5000;
    setTimeout(() => {
        removeNotification(id);
    }, duration);
  };

  const markNotificationsAsRead = () => {
    setHasUnreadNotifications(false);
  };
  
  const impersonateStaff = useCallback((staff: Staff, navigate: (path: string, options?: { replace?: boolean }) => void) => {
    alert(`Now impersonating ${staff.name}. You have been logged in as this user. Redirecting to dashboard.`);
    // In a real app, you might set a special token or update the session state.
    // For this demo, we can just navigate.
    navigate('/app/dashboard', { replace: true });
  }, []);

  const value = useMemo(
    () => ({
      isMaintenanceMode,
      setMaintenanceMode,
      maintenanceMessage,
      setMaintenanceMessage,
      session,
      user,
      loading,
      login,
      logout,
      language,
      setLanguage,
      currency,
      setCurrency,
      notificationPrefs,
      setNotificationPrefs,
      products,
      setProducts,
      suppliers,
      setSuppliers,
      purchaseOrders,
      setPurchaseOrders,
      stockCounts,
      setStockCounts,
      branches,
      setBranches,
      currentBranchId,
      setCurrentBranchId,
      stockTransfers,
      setStockTransfers,
      inventoryAdjustmentLogs,
      setInventoryAdjustmentLogs,
      scheduledJobs,
      setScheduledJobs,
      settings,
      setSettings,
      tenantSettings,
      setTenantSettings,
      blockRules,
      setBlockRules,
      staff,
      setStaff,
      tenantRoles,
      setTenantRoles,
      currentUserPermissions,
      approvedDevices,
      setApprovedDevices,
      pendingDevices,
      setPendingDevices,
      notifications,
      addNotification,
      removeNotification,
      notificationHistory,
      markNotificationsAsRead,
      userSubscription,
      setUserSubscription,
      subscriptionPlans,
      setSubscriptionPlans,
      hasUnreadNotifications,
      customers,
      setCustomers,
      trucks,
      setTrucks,
      drivers,
      setDrivers,
      consignments,
      setConsignments,
      impersonateStaff,
    }),
    [isMaintenanceMode, maintenanceMessage, session, user, loading, language, currency, notificationPrefs, products, suppliers, purchaseOrders, stockCounts, branches, currentBranchId, stockTransfers, settings, inventoryAdjustmentLogs, scheduledJobs, tenantSettings, blockRules, staff, tenantRoles, currentUserPermissions, approvedDevices, pendingDevices, notifications, notificationHistory, hasUnreadNotifications, userSubscription, subscriptionPlans, customers, trucks, drivers, consignments, impersonateStaff]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
}