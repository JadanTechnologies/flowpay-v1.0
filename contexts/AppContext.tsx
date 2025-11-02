

import React, { createContext, useState, useMemo, useContext, useEffect } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { Product, Supplier, PurchaseOrder, StockCount, Branch, StockTransfer, SystemSettings, ImpersonationState, Tenant, InventoryAdjustmentLog, ScheduledJob, TenantSettings, BlockRule, Staff, TenantRole, Device, Notification, UserSubscription, Customer, Truck, Driver, Consignment, SubscriptionPlan, TenantPermission } from '../types';
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
  impersonation: ImpersonationState;
  impersonateTenant: (tenant: Tenant, navigate: (path: string, options?: { replace?: boolean }) => void) => void;
  impersonateStaff: (staff: Staff, navigate: (path: string, options?: { replace?: boolean }) => void) => void;
  stopImpersonation: (navigate: (path: string, options?: { replace?: boolean }) => void) => void;
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
}


const defaultNotificationPrefs: NotificationPrefs = {
    salesEmail: true,
    salesPush: true,
    refundsEmail: true,
    lowStockEmail: true,
    lowStockSms: false,
    outOfStockEmail: true,
};

export const AppContext = createContext<AppContextType>({
  isMaintenanceMode: false,
  setMaintenanceMode: () => {},
  maintenanceMessage: "We'll be back soon!",
  setMaintenanceMessage: () => {},
  session: null,
  user: null,
  loading: true,
  login: async () => ({ data: { session: null }, error: null }),
  logout: async () => {},
  language: 'en',
  setLanguage: () => {},
  currency: 'USD',
  setCurrency: () => {},
  notificationPrefs: defaultNotificationPrefs,
  setNotificationPrefs: () => {},
  products: [],
  setProducts: () => {},
  suppliers: [],
  setSuppliers: () => {},
  purchaseOrders: [],
  setPurchaseOrders: () => {},
  stockCounts: [],
  setStockCounts: () => {},
  branches: [],
  setBranches: () => {},
  currentBranchId: 'br_1',
  setCurrentBranchId: () => {},
  stockTransfers: [],
  setStockTransfers: () => {},
  inventoryAdjustmentLogs: [],
  setInventoryAdjustmentLogs: () => {},
  scheduledJobs: [],
  setScheduledJobs: () => {},
  settings: null,
  setSettings: () => {},
  impersonation: { active: false, originalSession: null, targetName: null, returnPath: '' },
  impersonateTenant: () => {},
  impersonateStaff: () => {},
  stopImpersonation: () => {},
  tenantSettings: null,
  setTenantSettings: () => {},
  blockRules: [],
  setBlockRules: () => {},
  staff: [],
  setStaff: () => {},
  tenantRoles: [],
  setTenantRoles: () => {},
  currentUserPermissions: new Set(),
  approvedDevices: [],
  setApprovedDevices: () => {},
  pendingDevices: [],
  setPendingDevices: () => {},
  notifications: [],
  addNotification: () => {},
  removeNotification: () => {},
  notificationHistory: [],
  userSubscription: null,
  setUserSubscription: () => {},
  subscriptionPlans: [],
  setSubscriptionPlans: () => {},
  markNotificationsAsRead: () => {},
  hasUnreadNotifications: false,
  customers: [],
  setCustomers: () => {},
  trucks: [],
  setTrucks: () => {},
  drivers: [],
  setDrivers: () => {},
  consignments: [],
  setConsignments: () => {},
});

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

  const [impersonation, setImpersonation] = useState<ImpersonationState>({
    active: false,
    originalSession: null,
    targetName: null,
    returnPath: ''
  });

  // Notification State
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [notificationHistory, setNotificationHistory] = useState<Notification[]>([]);
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);

  useEffect(() => {
    if (isSupabaseConfigured) {
      const getSession = async () => {
        setLoading(true);
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
        setUser(session?.user ?? null);
        // Fetch real data from Supabase here in the future
        setProducts(mockProducts);
        setSuppliers(mockSuppliers);
        setPurchaseOrders(mockPurchaseOrders);
        setStockCounts(mockStockCounts);
        setBranches(mockBranches);
        setStaff(mockStaff);
        setStockTransfers(mockStockTransfers);
        setInventoryAdjustmentLogs(mockInventoryAdjustmentLogs);
        setScheduledJobs(mockScheduledJobs);
        setSettings(mockSettingsData);
        setTenantSettings(mockTenantSettings);
        setBlockRules(mockBlockRules);
        setTenantRoles(mockTenantRoles);
        setApprovedDevices(mockApprovedDevices);
        setPendingDevices(mockPendingDevices);
        setUserSubscription(mockUserSubscription);
        setSubscriptionPlans(mockPlans);
        setCustomers(mockCustomers);
        setTrucks(mockTrucks);
        setDrivers(mockDrivers);
        setConsignments(mockConsignments);
        setLoading(false);
      };
      getSession();

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
      });

      return () => {
        subscription?.unsubscribe();
      };
    } else {
      // Load mock data in demo mode
      setProducts(mockProducts);
      setSuppliers(mockSuppliers);
      setPurchaseOrders(mockPurchaseOrders);
      setStockCounts(mockStockCounts);
      setBranches(mockBranches);
      setStaff(mockStaff);
      setStockTransfers(mockStockTransfers);
      setInventoryAdjustmentLogs(mockInventoryAdjustmentLogs);
      setScheduledJobs(mockScheduledJobs);
      setSettings(mockSettingsData);
      setTenantSettings(mockTenantSettings);
      setBlockRules(mockBlockRules);
      setTenantRoles(mockTenantRoles);
      setApprovedDevices(mockApprovedDevices);
      setPendingDevices(mockPendingDevices);
      setUserSubscription(mockUserSubscription);
      setSubscriptionPlans(mockPlans);
      setCustomers(mockCustomers);
      setTrucks(mockTrucks);
      setDrivers(mockDrivers);
      setConsignments(mockConsignments);
      setLoading(false);
    }
  }, []);

  // Effect to calculate user permissions
  useEffect(() => {
    if (session?.user && staff.length > 0 && tenantRoles.length > 0) {
        // Find the staff member from mock data.
        const staffMember = staff.find(s => s.email === session.user.email);
        if (staffMember) {
            const role = tenantRoles.find(r => r.id === staffMember.roleId);
            if (role) {
                setCurrentUserPermissions(new Set(role.permissions));
            } else {
                setCurrentUserPermissions(new Set()); // No role found, no permissions
            }
        } else {
             // If user is logged in but not in staff list (e.g. main tenant owner), give them admin perms
            const adminRole = tenantRoles.find(r => r.name === 'Admin');
            if (adminRole) {
                setCurrentUserPermissions(new Set(adminRole.permissions));
            }
        }
    } else {
        setCurrentUserPermissions(new Set()); // No session, no permissions
    }
}, [session, staff, tenantRoles]);

  
  const login = async (email: string, pass: string) => {
    if (isSupabaseConfigured) {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password: pass });
        return { data, error };
    }
    
    // Mock login logic
    if ((email === 'admin@flowpay.com' && pass === '12345') || (email === 'superadmin@flowpay.com' && pass === '12345')) {
        const isSuperAdmin = email.startsWith('superadmin');
        const roleName = isSuperAdmin ? 'super_admin' : 'Admin';
        const mockUser: User = {
            id: isSuperAdmin ? 'mock-superadmin-id' : 'stf_5',
            email: email,
            app_metadata: { role: roleName },
            user_metadata: {},
            aud: 'authenticated',
            created_at: new Date().toISOString(),
        };
        const mockSession: Session = {
            access_token: 'mock-token',
            token_type: 'bearer',
            user: mockUser,
            expires_in: 3600,
            refresh_token: 'mock-refresh-token',
        };
        setSession(mockSession);
        setUser(mockUser);
        return { data: { session: mockSession }, error: null };
    } else {
        return { data: { session: null }, error: new Error("Invalid credentials for demo mode.") };
    }
  };

  const logout = async () => {
      if (isSupabaseConfigured) {
          await supabase.auth.signOut();
      } else {
          setSession(null);
          setUser(null);
      }
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

  const impersonateTenant = (tenant: Tenant, navigate: (path: string) => void) => {
    if (!session || session.user.app_metadata.role !== 'super_admin') {
      console.error("Only super admins can impersonate.");
      return;
    }

    const mockTenantUser: User = {
        id: tenant.id,
        email: tenant.email,
        app_metadata: { role: 'Admin' },
        user_metadata: { company_name: tenant.companyName },
        aud: 'authenticated',
        created_at: new Date().toISOString(),
    };
    const mockTenantSession: Session = {
        access_token: 'mock-tenant-token',
        token_type: 'bearer',
        user: mockTenantUser,
        expires_in: 3600,
        refresh_token: 'mock-tenant-refresh-token',
    };

    setImpersonation({
        active: true,
        originalSession: session,
        targetName: tenant.companyName,
        returnPath: '/admin/tenants',
    });
    setSession(mockTenantSession);
    setUser(mockTenantSession.user);
    setTimeout(() => navigate('/app/dashboard'), 0);
  };

  const impersonateStaff = (staffMember: Staff, navigate: (path: string) => void) => {
    const userRole = tenantRoles.find(r => r.id === (staff.find(s => s.email === session?.user?.email)?.roleId));
    const userRoleName = userRole?.name;
    
    const targetRole = tenantRoles.find(r => r.id === staffMember.roleId);
    if (!targetRole) {
        alert("Target user has an invalid role.");
        return;
    }
    const targetRoleName = targetRole.name;

    let canImpersonate = false;
    
    if (userRoleName === 'Admin' && targetRoleName !== 'Admin') {
        canImpersonate = true;
    }
    else if (userRoleName === 'Manager' && targetRoleName === 'Cashier') {
        canImpersonate = true;
    }
    
    if (session?.user?.email === staffMember.email) {
        canImpersonate = false;
    }

    if (!session || !canImpersonate) {
        alert("Insufficient permissions to impersonate this user.");
        console.error("Insufficient permissions to impersonate this user.");
        return;
    }

    const mockStaffUser: User = {
        id: staffMember.id,
        email: staffMember.email,
        app_metadata: { role: targetRoleName },
        user_metadata: { name: staffMember.name, branch: staffMember.branch },
        aud: 'authenticated',
        created_at: new Date().toISOString(),
    };
    const mockStaffSession: Session = {
        access_token: 'mock-staff-token',
        token_type: 'bearer',
        user: mockStaffUser,
        expires_in: 3600,
        refresh_token: 'mock-staff-refresh-token',
    };

    setImpersonation({
        active: true,
        originalSession: session,
        targetName: staffMember.name,
        returnPath: '/app/staff',
    });
    setSession(mockStaffSession);
    setUser(mockStaffSession.user);
    setTimeout(() => navigate('/app/dashboard'), 0);
  };

  const stopImpersonation = (navigate: (path: string) => void) => {
      if (impersonation.active && impersonation.originalSession) {
          const returnPath = impersonation.returnPath;
          const originalSess = impersonation.originalSession;

          setImpersonation({ active: false, originalSession: null, targetName: null, returnPath: '' });
          setSession(originalSess);
          setUser(originalSess.user);
          
          setTimeout(() => {
              navigate(returnPath);
          }, 0);
      }
  };

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
      impersonation,
      impersonateTenant,
      impersonateStaff,
      stopImpersonation,
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
    }),
    [isMaintenanceMode, maintenanceMessage, session, user, loading, language, currency, notificationPrefs, products, suppliers, purchaseOrders, stockCounts, branches, currentBranchId, stockTransfers, settings, impersonation, inventoryAdjustmentLogs, scheduledJobs, tenantSettings, blockRules, staff, tenantRoles, currentUserPermissions, approvedDevices, pendingDevices, notifications, notificationHistory, hasUnreadNotifications, userSubscription, subscriptionPlans, customers, trucks, drivers, consignments]
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