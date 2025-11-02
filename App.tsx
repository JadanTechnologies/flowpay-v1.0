

import React, { useEffect, useMemo } from 'react';
// FIX: The `react-router-dom` module seems to have CJS/ESM interop issues in this environment. Using a namespace import as a workaround.
import * as ReactRouterDOM from 'react-router-dom';
const { HashRouter, Routes, Route, Navigate, useLocation, useNavigate } = ReactRouterDOM;
import { AppProvider, useAppContext } from './contexts/AppContext';
import { ModuleId } from './types';

// Layouts
import TenantLayout from './layouts/TenantLayout';
import SuperAdminLayout from './layouts/SuperAdminLayout';

// Public Pages
import LandingPage from './pages/LandingPage';
import MaintenancePage from './pages/MaintenancePage';

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
import TenantAccessControlPage from './pages/settings/AccessControlPage';
import ViewSubscriptionDetailsPage from './pages/settings/ViewSubscriptionDetailsPage';
import ManageBillingPage from './pages/settings/ManageBillingPage';
import PaymentHistoryPage from './pages/settings/PaymentHistoryPage';
import FleetPage from './pages/logistics/FleetPage';
import ConsignmentsPage from './pages/logistics/ConsignmentsPage';


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
import AccessControlPage from './pages/superadmin/AccessControlPage';
import AppManagementPage from './pages/superadmin/AppManagementPage';
import FeatureControlPage from './pages/superadmin/FeatureControlPage';

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

const FeatureRoute: React.FC<{ moduleId: ModuleId, element: React.ReactNode }> = ({ moduleId, element }) => {
  const { settings, userSubscription, subscriptionPlans, addNotification } = useAppContext();
  const navigate = useNavigate();

  const isEnabled = useMemo(() => {
    // 1. Check global feature flag
    const globallyEnabled = settings?.featureFlags?.[moduleId] ?? false;

    // 2. Check subscription plan
    if (!userSubscription || !subscriptionPlans) return false;
    const currentPlan = subscriptionPlans.find(p => p.name.toLowerCase() === userSubscription.planId);
    const planEnabled = currentPlan?.enabledModules.includes(moduleId) ?? false;

    return globallyEnabled && planEnabled;
  }, [settings, userSubscription, subscriptionPlans, moduleId]);

  useEffect(() => {
    if (!isEnabled) {
        addNotification({
            message: 'This feature is not available for your account.',
            type: 'warning'
        });
    }
  }, [isEnabled, addNotification]);
  
  if (settings === null) return null; // Wait for settings to load

  return isEnabled ? <>{element}</> : <Navigate to="/app/dashboard" replace />;
};

const AppRoutes: React.FC = () => {
  const { settings } = useAppContext();
  const location = useLocation();
  const isSuperAdminPath = location.pathname.startsWith('/admin');
  const isMaintenanceMode = settings?.isMaintenanceMode ?? false;

  if (isMaintenanceMode && !isSuperAdminPath) {
    return (
      <Routes>
        <Route path="*" element={<MaintenancePage />} />
      </Routes>
    );
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />

      {/* Auth Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<TenantSignupPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/admin/login" element={<LoginPage />} />

      {/* Tenant Application Routes */}
      <Route path="/app" element={<TenantLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="pos" element={<FeatureRoute moduleId="pos" element={<PosPage />} />} />
        <Route path="inventory" element={<FeatureRoute moduleId="inventory" element={<InventoryPage />} />} />
        <Route path="inventory/purchase-orders" element={<FeatureRoute moduleId="inventory" element={<PurchaseOrdersPage />} />} />
        <Route path="inventory/stock-counts" element={<FeatureRoute moduleId="inventory" element={<StockCountsPage />} />} />
        <Route path="inventory/stock-transfers" element={<FeatureRoute moduleId="inventory" element={<StockTransfersPage />} />} />
        <Route path="inventory/suppliers" element={<FeatureRoute moduleId="inventory" element={<SuppliersPage />} />} />
        <Route path="inventory/history" element={<FeatureRoute moduleId="inventory" element={<InventoryHistoryPage />} />} />
        <Route path="accounting" element={<FeatureRoute moduleId="reports" element={<AccountingPage />} />} />
        <Route path="logistics" element={<FeatureRoute moduleId="logistics" element={<LogisticsPage />} />} />
        <Route path="logistics/fleet" element={<FeatureRoute moduleId="logistics" element={<FleetPage />} />} />
        <Route path="logistics/consignments" element={<FeatureRoute moduleId="logistics" element={<ConsignmentsPage />} />} />
        <Route path="branches" element={<FeatureRoute moduleId="branches" element={<BranchManagementPage />} />} />
        <Route path="staff" element={<FeatureRoute moduleId="staff" element={<StaffManagementPage />} />} />
        <Route path="automations" element={<FeatureRoute moduleId="automations" element={<AutomationsPage />} />} />
        <Route path="invoicing" element={<FeatureRoute moduleId="invoicing" element={<InvoicingPage />} />} />
        <Route path="credit-management" element={<FeatureRoute moduleId="credit_management" element={<CreditManagementPage />} />} />
        <Route path="activity" element={<FeatureRoute moduleId="activityLog" element={<ActivityLogPage />} />} />
        <Route path="settings" element={<SettingsPage />}>
          <Route index element={<Navigate to="profile" replace />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="subscription-details" element={<ViewSubscriptionDetailsPage />} />
          <Route path="manage-billing" element={<ManageBillingPage />} />
          <Route path="payment-history" element={<PaymentHistoryPage />} />
          <Route path="notifications" element={<NotificationsPage />} />
          <Route path="security" element={<SecurityPage />} />
          <Route path="integrations" element={<IntegrationsPage />} />
          <Route path="access-control" element={<TenantAccessControlPage />} />
        </Route>
      </Route>

      {/* Super Admin Routes */}
      <Route path="/admin" element={<SuperAdminLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<SuperAdminDashboardPage />} />
          <Route path="tenants" element={<TenantsPage />} />
          <Route path="tenants/:tenantId/activity" element={<TenantActivityLogPage />} />
          <Route path="subscriptions" element={<SubscriptionsPage />} />
          <Route path="payments" element={<PaymentsPage />} />
          <Route path="announcements" element={<AnnouncementsPage />} />
          <Route path="templates" element={<TemplatesPage />} />
          <Route path="team" element={<TeamManagementPage />} />
          <Route path="cron-jobs" element={<CronJobsPage />} />
          <Route path="access-control" element={<AccessControlPage />} />
          <Route path="app-management" element={<AppManagementPage />} />
          <Route path="feature-control" element={<FeatureControlPage />} />
          <Route path="system-settings" element={<SystemSettingsPage />} />
      </Route>
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <HashRouter>
        <DynamicHead />
        <AppRoutes />
      </HashRouter>
    </AppProvider>
  );
};

export default App;