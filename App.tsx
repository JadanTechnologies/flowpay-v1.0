import React from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AppProvider, useAppContext } from './contexts/AppContext';

// Layouts
import TenantLayout from './layouts/TenantLayout';
import SuperAdminLayout from './layouts/SuperAdminLayout';

// Core Pages
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
import LogisticsPage from './pages/LogisticsPage';
import BranchManagementPage from './pages/BranchManagementPage';
import StaffManagementPage from './pages/StaffManagementPage';
import AutomationsPage from './pages/AutomationsPage';
import InvoicingPage from './pages/InvoicingPage';
import CreditManagementPage from './pages/CreditManagementPage';
import ActivityLogPage from './pages/ActivityLogPage';

// Inventory Sub-pages
import InventoryPage from './pages/InventoryPage';
import PurchaseOrdersPage from './pages/inventory/PurchaseOrdersPage';
import StockTransfersPage from './pages/inventory/StockTransfersPage';
import StockCountsPage from './pages/inventory/StockCountsPage';
import SuppliersPage from './pages/inventory/SuppliersPage';
import InventoryHistoryPage from './pages/inventory/InventoryHistoryPage';

// Accounting/Reports Page
import AccountingPage from './pages/AccountingPage';

// Logistics Sub-pages
import ConsignmentsPage from './pages/logistics/ConsignmentsPage';
import FleetPage from './pages/logistics/FleetPage';

// Settings Pages
import SettingsPage from './pages/SettingsPage';
import ProfilePage from './pages/settings/ProfilePage';
import ViewSubscriptionDetailsPage from './pages/settings/ViewSubscriptionDetailsPage';
import ManageBillingPage from './pages/settings/ManageBillingPage';
import PaymentHistoryPage from './pages/settings/PaymentHistoryPage';
import NotificationsPage from './pages/settings/NotificationsPage';
import SecurityPage from './pages/settings/SecurityPage';
import IntegrationsPage from './pages/settings/IntegrationsPage';
import AccessControlPage from './pages/settings/AccessControlPage';

// Super Admin Pages
import SuperAdminDashboardPage from './pages/superadmin/SuperAdminDashboardPage';
import TenantsPage from './pages/superadmin/TenantsPage';
import TenantActivityLogPage from './pages/superadmin/TenantActivityLogPage';
import SubscriptionsPage from './pages/superadmin/SubscriptionsPage';
import PaymentsPage from './pages/superadmin/PaymentsPage';
import AnnouncementsPage from './pages/superadmin/AnnouncementsPage';
import TemplatesPage from './pages/superadmin/TemplatesPage';
import TeamManagementPage from './pages/superadmin/TeamManagementPage';
import FeatureControlPage from './pages/superadmin/FeatureControlPage';
import CronJobsPage from './pages/superadmin/CronJobsPage';
import SuperAdminAccessControlPage from './pages/superadmin/AccessControlPage';
import SystemSettingsPage from './pages/superadmin/SystemSettingsPage';
import AppManagementPage from './pages/superadmin/AppManagementPage';
import SuperAdminProfilePage from './pages/superadmin/ProfilePage';

const AppRoutes: React.FC = () => {
    const { settings, session, loading } = useAppContext();
    const location = useLocation();

    if (loading) {
        return (
          <div className="flex h-screen w-full items-center justify-center bg-background">
              <div className="text-text-primary">Loading Application...</div>
          </div>
        );
    }
    
    // Global Maintenance Mode check
    if (settings?.isMaintenanceMode) {
        const isSuperAdmin = session?.user?.app_metadata?.role === 'super_admin';
        // Allow super admin access only to admin routes, otherwise show maintenance
        if (!isSuperAdmin || (isSuperAdmin && !location.pathname.startsWith('/admin'))) {
            return <MaintenancePage />;
        }
    }

    return (
        <Routes>
            {/* Public/Landing Pages */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/signup" element={<TenantSignupPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/terms" element={<ContentPage title="Terms of Service" contentKey="termsContent" settingsKey="settings" />} />
            <Route path="/privacy" element={<ContentPage title="Privacy Policy" contentKey="privacyContent" settingsKey="settings" />} />
            <Route path="/refund" element={<ContentPage title="Refund Policy" contentKey="refundContent" settingsKey="settings" />} />
            
            {/* Auth Pages (handled as one component) */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/admin/login" element={<LoginPage />} />

            {/* Tenant Application Routes */}
            <Route path="/app" element={<TenantLayout />}>
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<DashboardPage />} />
                <Route path="pos" element={<PosPage />} />
                
                <Route path="inventory">
                    <Route index element={<InventoryPage />} />
                    <Route path="purchase-orders" element={<PurchaseOrdersPage />} />
                    <Route path="stock-transfers" element={<StockTransfersPage />} />
                    <Route path="stock-counts" element={<StockCountsPage />} />
                    <Route path="suppliers" element={<SuppliersPage />} />
                    <Route path="history" element={<InventoryHistoryPage />} />
                </Route>
                
                <Route path="logistics">
                    <Route index element={<LogisticsPage />} />
                    <Route path="consignments" element={<ConsignmentsPage />} />
                    <Route path="fleet" element={<FleetPage />} />
                </Route>

                <Route path="accounting" element={<AccountingPage />} />
                <Route path="branches" element={<BranchManagementPage />} />
                <Route path="staff" element={<StaffManagementPage />} />
                <Route path="automations" element={<AutomationsPage />} />
                <Route path="invoicing" element={<InvoicingPage />} />
                <Route path="credit-management" element={<CreditManagementPage />} />
                <Route path="activity" element={<ActivityLogPage />} />

                <Route path="settings" element={<SettingsPage />}>
                    <Route index element={<Navigate to="profile" replace />} />
                    <Route path="profile" element={<ProfilePage />} />
                    <Route path="subscription-details" element={<ViewSubscriptionDetailsPage />} />
                    <Route path="manage-billing" element={<ManageBillingPage />} />
                    <Route path="payment-history" element={<PaymentHistoryPage />} />
                    <Route path="notifications" element={<NotificationsPage />} />
                    <Route path="security" element={<SecurityPage />} />
                    <Route path="integrations" element={<IntegrationsPage />} />
                    <Route path="access-control" element={<AccessControlPage />} />
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
                <Route path="feature-control" element={<FeatureControlPage />} />
                <Route path="cron-jobs" element={<CronJobsPage />} />
                <Route path="access-control" element={<SuperAdminAccessControlPage />} />
                <Route path="system-settings" element={<SystemSettingsPage />} />
                <Route path="app-management" element={<AppManagementPage />} />
                <Route path="profile" element={<SuperAdminProfilePage />} />
            </Route>
            
            {/* Fallback Route */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
};

const App: React.FC = () => {
    return (
        <AppProvider>
            <HashRouter>
                <AppRoutes />
            </HashRouter>
        </AppProvider>
    );
};

export default App;
