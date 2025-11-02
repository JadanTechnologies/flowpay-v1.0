



import React, { createContext, useState, useMemo, useContext, useEffect, useCallback } from 'react';
import { User, Session, Product, Supplier, PurchaseOrder, StockCount, Branch, StockTransfer, SystemSettings, Tenant, InventoryAdjustmentLog, ScheduledJob, TenantSettings, BlockRule, Staff, TenantRole, Device, Notification, UserSubscription, Customer, Truck, Driver, Consignment, SubscriptionPlan, TenantPermission, ProductVariant } from '../types';
import { posProducts as mockProducts, suppliers as mockSuppliers, purchaseOrders as mockPurchaseOrders, stockCounts as mockStockCounts, branches as mockBranches, stockTransfers as mockStockTransfers, systemSettings as mockSettingsData, inventoryAdjustmentLogs as mockInventoryAdjustmentLogs, scheduledJobs as mockScheduledJobs, tenantSettings as mockTenantSettings, blockRules as mockBlockRules, tenantRoles as mockTenantRoles, approvedDevices as mockApprovedDevices, pendingDevices as mockPendingDevices, userSubscription as mockUserSubscription, customers as mockCustomers, trucks as mockTrucks, drivers as mockDrivers, consignments as mockConsignments, subscriptionPlans as mockPlans, staff as mockStaff } from '../data/mockData';


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

const loadMockData = (setters: any) => {
    setters.setProducts(mockProducts);
    setters.setSuppliers(mockSuppliers);
    setters.setPurchaseOrders(mockPurchaseOrders);
    setters.setStockCounts(mockStockCounts);
    setters.setBranches(mockBranches);
    setters.setStaff(mockStaff);
    setters.setStockTransfers(mockStockTransfers);
    setters.setInventoryAdjustmentLogs(mockInventoryAdjustmentLogs);
    setters.setScheduledJobs(mockScheduledJobs);
    setters.setSettings(mockSettingsData);
    setters.setTenantSettings(mockTenantSettings);
    setters.setBlockRules(mockBlockRules);
    setters.setTenantRoles(mockTenantRoles);
    setters.setApprovedDevices(mockApprovedDevices);
    setters.setPendingDevices(mockPendingDevices);
    setters.setUserSubscription(mockUserSubscription);
    setters.setSubscriptionPlans(mockPlans);
    setters.setCustomers(mockCustomers);
    setters.setTrucks(mockTrucks);
    setters.setDrivers(mockDrivers);
    setters.setConsignments(mockConsignments);
};

// --- API Functions for cPanel/PHP Backend ---
const fetchDataFromApi = async (setters: any) => {
    console.log("Fetching data from custom API...");
    const token = localStorage.getItem('flowpay_token');
    if (!token) return; // Don't fetch if not logged in

    try {
        // Example: Fetch products
        // const res = await fetch('/api/products', { headers: { 'Authorization': `Bearer ${token}` } });
        // const productsData = await res.json();
        // setters.setProducts(productsData);

        // For now, we continue to load mock data for simplicity
        loadMockData(setters);

    } catch (error) {
        console.error("Failed to fetch data from API:", error);
    }
};

const loginWithApi = async (email: string, pass: string, setSession: Function, setUser: Function) => {
    const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: pass }),
    });

    if (!response.ok) {
        let errorMessage = `Login failed with status: ${response.status}`;
        try {
            // Try to parse a JSON error response from the backend
            const errorData = await response.json();
            errorMessage = errorData.error || errorMessage;
        } catch (e) {
            // If parsing fails, it means the response was not JSON (e.g., HTML 404 page).
            // The default error message is sufficient.
            console.error("Could not parse error response as JSON.");
        }
        throw new Error(errorMessage);
    }
    
    const data = await response.json();
    
    localStorage.setItem('flowpay_token', data.token);

    // Create a session object that resembles the structure our app expects
    const session: Session = {
        access_token: data.token,
        token_type: 'bearer',
        user: data.user,
    };
    
    setSession(session);
    setUser(data.user);

    return { data: { session: session }, error: null };
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMaintenanceMode, setMaintenanceMode] = useState(false);
  const [maintenanceMessage, setMaintenanceMessage] = useState(
    "We are currently undergoing scheduled maintenance. We'll be back shortly."
  );
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState<Language>('en');
  const [currency, setCurrency] = useState<Currency>('USD');
  const [notificationPrefs, setNotificationPrefs] = useState<NotificationPrefs>(defaultNotificationPrefs);
  const [currentBranchId, setCurrentBranchId] = useState<string>('br_1');
  
  // Centralized data states
  const [products, setProducts] = useState<Product[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [stockCounts, setStockCounts] = useState<StockCount[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [stockTransfers, setStockTransfers] = useState<StockTransfer[]>([]);
  const [inventoryAdjustmentLogs, setInventoryAdjustmentLogs] = useState<InventoryAdjustmentLog[]>([]);
  const [scheduledJobs, setScheduledJobs] = useState<ScheduledJob[]>([]);
  const [settings, setSettings] = useState<SystemSettings | null>(null);
  const [tenantSettings, setTenantSettings] = useState<TenantSettings | null>(null);
  const [blockRules, setBlockRules] = useState<BlockRule[]>([]);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [tenantRoles, setTenantRoles] = useState<TenantRole[]>([]);
  const [approvedDevices, setApprovedDevices] = useState<Device[]>([]);
  const [pendingDevices, setPendingDevices] = useState<Device[]>([]);
  const [userSubscription, setUserSubscription] = useState<UserSubscription | null>(null);
  const [subscriptionPlans, setSubscriptionPlans] = useState<SubscriptionPlan[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [trucks, setTrucks] = useState<Truck[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [consignments, setConsignments] = useState<Consignment[]>([]);
  const [currentUserPermissions, setCurrentUserPermissions] = useState<Set<TenantPermission>>(new Set());

  // Notification State
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [notificationHistory, setNotificationHistory] = useState<Notification[]>([]);
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);

  useEffect(() => {
    const initializeApp = async () => {
        setLoading(true);
        const setters = { setProducts, setSuppliers, setPurchaseOrders, setStockCounts, setBranches, setStaff, setStockTransfers, setInventoryAdjustmentLogs, setScheduledJobs, setSettings, setTenantSettings, setBlockRules, setTenantRoles, setApprovedDevices, setPendingDevices, setUserSubscription, setSubscriptionPlans, setCustomers, setTrucks, setDrivers, setConsignments };

        console.log("Running in API-only mode.");
        const token = localStorage.getItem('flowpay_token');
        if (token) {
            // In a real app, you'd verify the token with the backend and get user info.
            // Here, we'll just re-create a mock session.
            const mockUser: User = { id: 'user_2', email: 'admin@flowpay.com', app_metadata: { role: 'Admin', tenant_id: 'tnt_2' }, user_metadata: { name: 'Admin User' }};
            const mockSession: Session = { access_token: token, token_type: 'bearer', user: mockUser };
            setSession(mockSession);
            setUser(mockUser);
        }
        fetchDataFromApi(setters);
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
        } else if (session.user.app_metadata.role === 'Admin') {
            const adminRole = tenantRoles.find(r => r.name === 'Admin');
            if (adminRole) setCurrentUserPermissions(new Set(adminRole.permissions as TenantPermission[]));
        }
    } else {
        setCurrentUserPermissions(new Set());
    }
  }, [session, staff, tenantRoles]);

  
  const login = async (email: string, pass: string) => {
    return await loginWithApi(email, pass, setSession, setUser);
  };

  const logout = async () => {
    localStorage.removeItem('flowpay_token');
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