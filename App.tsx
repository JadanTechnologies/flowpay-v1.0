

import React, { useEffect, useMemo } from 'react';
// FIX: The `react-router-dom` module seems to have CJS/ESM interop issues in this environment. Using a namespace import as a workaround.
import * as ReactRouterDOM from 'react-router-dom';
import { AppProvider, useAppContext } from './contexts/AppContext';
import { ModuleId, TenantPermission } from './types';

// Layouts
import TenantLayout from './layouts/TenantLayout';
import SuperAdminLayout from './layouts/SuperAdminLayout';

// Public Pages
import LandingPage from './pages/LandingPage';
import MaintenancePage from './pages/MaintenancePage';
import ContentPage from './pages/ContentPage';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';
import TenantSignupPage from './pages/auth/TenantSignupPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';


// Tenant Pages
import DashboardPage from './pages/DashboardPage';
import PosPage from './pages/PosPage';
import InventoryPage from './pages/InventoryPage';
import AccountingPage from './pages/AccountingPage';
import LogisticsPage from './pages/LogisticsPage';
import SettingsPage from './pages/SettingsPage';
import ProfilePage from './pages/settings/ProfilePage';
import NotificationsPage from './pages/settings/NotificationsPage';
import SecurityPage from './pages/settings/SecurityPage';
import IntegrationsPage from './pages/settings/IntegrationsPage';
import BranchManagementPage from './pages/BranchManagementPage';
import StaffManagementPage from './pages/StaffManagementPage';
import InvoicingPage from './pages/InvoicingPage';
import CreditManagementPage from './pages/CreditManagementPage';
import ActivityLogPage from './pages/ActivityLogPage';
import PurchaseOrdersPage from './pages/inventory/PurchaseOrdersPage';
import StockCountsPage from './pages/inventory/StockCountsPage';
import SuppliersPage from './pages/inventory/SuppliersPage';
import StockTransfersPage from './pages/inventory/StockTransfersPage';
import InventoryHistoryPage from './pages/inventory/InventoryHistoryPage';
import AutomationsPage from './pages/AutomationsPage';
import ViewSubscriptionDetailsPage from './pages/settings/ViewSubscriptionDetailsPage';
import ManageBillingPage from './pages/settings/ManageBillingPage';
import PaymentHistoryPage from './pages/settings/PaymentHistoryPage';
import FleetPage from './pages/logistics/FleetPage';
import ConsignmentsPage from './pages/logistics/ConsignmentsPage';
import AccessControlPage from './pages/settings/AccessControlPage';


// Super Admin Pages
import SuperAdminDashboardPage from './pages/superadmin/SuperAdminDashboardPage';
import TenantsPage from './pages/superadmin/TenantsPage';
import SubscriptionsPage from './pages/superadmin/SubscriptionsPage';
import SystemSettingsPage from './pages/superadmin/SystemSettingsPage';
import PaymentsPage from './pages/superadmin/PaymentsPage';
import TeamManagementPage from './pages/superadmin/TeamManagementPage';
import AnnouncementsPage from './pages/superadmin/AnnouncementsPage';
import TemplatesPage from './pages/superadmin/TemplatesPage';
import CronJobsPage from './pages/superadmin/CronJobsPage';
import TenantActivityLogPage from './pages/superadmin/TenantActivityLogPage';
import SuperAdminAccessControlPage from './pages/superadmin/AccessControlPage';
import FeatureControlPage from './pages/superadmin/FeatureControlPage';
import SuperAdminProfilePage from './pages/superadmin/ProfilePage';

const DynamicHead: React.FC = () => {
    const { settings } = useAppContext();
    useEffect(() => {
        if (settings?.branding) {
            document.title = settings.branding.platformName;
            const favicon = document.querySelector("link[rel='icon']");
            if (favicon) {
                favicon.setAttribute('href', settings.branding.faviconUrl);
            }
        }
    }, [settings?.branding]);
    return null;
};

const moduleIdToPermissionMap: Partial<Record<ModuleId, TenantPermission>> = {
    pos: 'manage_pos',
    inventory: 'manage_inventory',
    reports: 'view_reports',
    logistics: 'manage_logistics',
    branches: 'manage_branches',
    staff: 'manage_staff',
    automations: 'manage_automations',
    invoicing: 'manage_invoicing',
    credit_management: 'manage_credit',
    activityLog: 'view_activity_log',
};

const FeatureRoute: React.FC<{ moduleId: ModuleId, element: React.ReactNode }> = ({ moduleId, element }) => {
  const { settings, userSubscription, subscriptionPlans, addNotification, currentUserPermissions } = useAppContext();

  const isEnabled = useMemo(() => {
    // 1. Check global feature flag
    const globallyEnabled = settings?.featureFlags?.[moduleId] ?? false;

    // 2. Check subscription plan
    if (!userSubscription || !subscriptionPlans) return false;
    const currentPlan = subscriptionPlans.find(p => p.name.toLowerCase() === userSubscription.planId);
    const planEnabled = currentPlan?.enabledModules.includes(moduleId) ?? false;

    // 3. Check user permission
    const requiredPermission = moduleIdToPermissionMap[moduleId];
    const userHasPermission = !requiredPermission || currentUserPermissions.has(requiredPermission);

    return globallyEnabled && planEnabled && userHasPermission;
  }, [settings, userSubscription, subscriptionPlans, moduleId, currentUserPermissions]);

  useEffect(() => {
    if (!isEnabled) {
        addNotification({
            message: "You don't have permission to access this feature.",
            type: 'warning'
        });
    }
  }, [isEnabled, addNotification]);
  
  if (settings === null) return null; // Wait for settings to load

  return isEnabled ? <>{element}</> : <ReactRouterDOM.Navigate to="/app/dashboard" replace />;
};

const PermissionGuard: React.FC<{ permission: TenantPermission, element: React.ReactNode }> = ({ permission, element }) => {
    const { currentUserPermissions, addNotification } = useAppContext();

    const hasPermission = useMemo(() => currentUserPermissions.has(permission), [currentUserPermissions, permission]);

    useEffect(() => {
        if (!hasPermission) {
            addNotification({
                message: "Access Denied: You don't have permission to view this page.",
                type: 'error'
            });
        }
    }, [hasPermission, addNotification]);

    return hasPermission ? <>{element}</> : <ReactRouterDOM.Navigate to="/app/dashboard" replace />;
};

const AppRoutes: React.FC = () => {
  const { settings } = useAppContext();
  const location = ReactRouterDOM.useLocation();
  const isSuperAdminPath = location.pathname.startsWith('/admin');
  const isMaintenanceMode = settings?.isMaintenanceMode ?? false;

  if (isMaintenanceMode && !isSuperAdminPath) {
    return (
      <ReactRouterDOM.Routes>
        <ReactRouterDOM.Route path="*" element={<MaintenancePage />} />
      </ReactRouterDOM.Routes>
    );
  }

  return (
    <ReactRouterDOM.Routes>
      {/* Public Routes */}
      <ReactRouterDOM.Route path="/" element={<LandingPage />} />
      <ReactRouterDOM.Route path="/terms" element={<ContentPage title="Terms of Service" contentKey="termsContent" settingsKey="settings" />} />
      <ReactRouterDOM.Route path="/privacy" element={<ContentPage title="Privacy Policy" contentKey="privacyContent" settingsKey="settings" />} />
      <ReactRouterDOM.Route path="/refund" element={<ContentPage title="Refund Policy" contentKey="refundContent" settingsKey="settings" />} />
      <ReactRouterDOM.Route path="/about" element={<ContentPage title="About Us" contentKey="aboutUsContent" settingsKey="branding" />} />
      <ReactRouterDOM.Route path="/blog" element={<ContentPage title="Blog" contentKey="blogContent" settingsKey="branding" />} />
      <ReactRouterDOM.Route path="/contact" element={<ContentPage title="Contact Us" contentKey="contactUsContent" settingsKey="branding" />} />

      {/* Auth Routes */}
      <ReactRouterDOM.Route path="/login" element={<LoginPage />} />
      <ReactRouterDOM.Route path="/signup" element={<TenantSignupPage />} />
      <ReactRouterDOM.Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <ReactRouterDOM.Route path="/admin/login" element={<LoginPage />} />

      {/* Tenant Application Routes */}
      <ReactRouterDOM.Route path="/app" element={<TenantLayout />}>
        <ReactRouterDOM.Route index element={<ReactRouterDOM.Navigate to="dashboard" replace />} />
        <ReactRouterDOM.Route path="dashboard" element={<DashboardPage />} />
        <ReactRouterDOM.Route path="pos" element={<FeatureRoute moduleId="pos" element={<PosPage />} />} />
        <ReactRouterDOM.Route path="inventory" element={<FeatureRoute moduleId="inventory" element={<InventoryPage />} />} />
        <ReactRouterDOM.Route path="inventory/purchase-orders" element={<FeatureRoute moduleId="inventory" element={<PurchaseOrdersPage />} />} />
        <ReactRouterDOM.Route path="inventory/stock-counts" element={<FeatureRoute moduleId="inventory" element={<StockCountsPage />} />} />
        <ReactRouterDOM.Route path="inventory/stock-transfers" element={<FeatureRoute moduleId="inventory" element={<StockTransfersPage />} />} />
        <ReactRouterDOM.Route path="inventory/suppliers" element={<FeatureRoute moduleId="inventory" element={<SuppliersPage />} />} />
        <ReactRouterDOM.Route path="inventory/history" element={<FeatureRoute moduleId="inventory" element={<InventoryHistoryPage />} />} />
        <ReactRouterDOM.Route path="accounting" element={<FeatureRoute moduleId="reports" element={<AccountingPage />} />} />
        <ReactRouterDOM.Route path="logistics" element={<FeatureRoute moduleId="logistics" element={<LogisticsPage />} />} />
        <ReactRouterDOM.Route path="logistics/fleet" element={<FeatureRoute moduleId="logistics" element={<FleetPage />} />} />
        <ReactRouterDOM.Route path="logistics/consignments" element={<FeatureRoute moduleId="logistics" element={<ConsignmentsPage />} />} />
        <ReactRouterDOM.Route path="branches" element={<FeatureRoute moduleId="branches" element={<BranchManagementPage />} />} />
        <ReactRouterDOM.Route path="staff" element={<FeatureRoute moduleId="staff" element={<StaffManagementPage />} />} />
        <ReactRouterDOM.Route path="automations" element={<FeatureRoute moduleId="automations" element={<AutomationsPage />} />} />
        <ReactRouterDOM.Route path="invoicing" element={<FeatureRoute moduleId="invoicing" element={<InvoicingPage />} />} />
        <ReactRouterDOM.Route path="credit-management" element={<FeatureRoute moduleId="credit_management" element={<CreditManagementPage />} />} />
        <ReactRouterDOM.Route path="activity" element={<FeatureRoute moduleId="activityLog" element={<ActivityLogPage />} />} />
        <ReactRouterDOM.Route path="settings" element={<PermissionGuard permission="access_settings" element={<SettingsPage />} />}>
          <ReactRouterDOM.Route index element={<ReactRouterDOM.Navigate to="profile" replace />} />
          <ReactRouterDOM.Route path="profile" element={<ProfilePage />} />
          <ReactRouterDOM.Route path="subscription-details" element={<ViewSubscriptionDetailsPage />} />
          <ReactRouterDOM.Route path="manage-billing" element={<ManageBillingPage />} />
          <ReactRouterDOM.Route path="payment-history" element={<PaymentHistoryPage />} />
          <ReactRouterDOM.Route path="notifications" element={<NotificationsPage />} />
          <ReactRouterDOM.Route path="security" element={<SecurityPage />} />
          <ReactRouterDOM.Route path="integrations" element={<IntegrationsPage />} />
          <ReactRouterDOM.Route path="access-control" element={<AccessControlPage />} />
        </ReactRouterDOM.Route>
      </ReactRouterDOM.Route>

      {/* Super Admin Routes */}
      <ReactRouterDOM.Route path="/admin" element={<SuperAdminLayout />}>
          <ReactRouterDOM.Route index element={<ReactRouterDOM.Navigate to="dashboard" replace />} />
          <ReactRouterDOM.Route path="dashboard" element={<SuperAdminDashboardPage />} />
          <ReactRouterDOM.Route path="tenants" element={<TenantsPage />} />
          <ReactRouterDOM.Route path="tenants/:tenantId/activity" element={<TenantActivityLogPage />} />
          <ReactRouterDOM.Route path="subscriptions" element={<SubscriptionsPage />} />
          <ReactRouterDOM.Route path="payments" element={<PaymentsPage />} />
          <ReactRouterDOM.Route path="announcements" element={<AnnouncementsPage />} />
          <ReactRouterDOM.Route path="templates" element={<TemplatesPage />} />
          <ReactRouterDOM.Route path="team" element={<TeamManagementPage />} />
          <ReactRouterDOM.Route path="cron-jobs" element={<CronJobsPage />} />
          <ReactRouterDOM.Route path="access-control" element={<SuperAdminAccessControlPage />} />
          <ReactRouterDOM.Route path="feature-control" element={<FeatureControlPage />} />
          <ReactRouterDOM.Route path="system-settings" element={<SystemSettingsPage />} />
          <ReactRouterDOM.Route path="profile" element={<SuperAdminProfilePage />} />
      </ReactRouterDOM.Route>
    </ReactRouterDOM.Routes>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <ReactRouterDOM.HashRouter>
        <DynamicHead />
        <AppRoutes />
      </ReactRouterDOM.HashRouter>
    </AppProvider>
  );
};

export default App;