// Define cache names. A new version will clear old caches.
const STATIC_CACHE_NAME = 'flowpay-static-cache-v1';
const DATA_CACHE_NAME = 'flowpay-data-cache-v1';
const API_URL_PART = '/api/'; // A string to identify API calls

// List of essential assets to be pre-cached.
const STATIC_ASSETS = [
  // Core files
  '/',
  '/index.html',
  '/manifest.json',
  '/vite.svg',
  '/index.tsx',
  '/App.tsx',
  '/types.ts',

  // Lib, hooks, contexts, etc.
  '/lib/supabaseClient.ts',
  '/lib/payment.ts',
  '/contexts/AppContext.tsx',
  '/hooks/useTranslation.ts',
  '/hooks/useInactivityLogout.ts',
  '/data/mockData.ts',
  '/utils/formatting.ts',

  // Layouts
  '/layouts/TenantLayout.tsx',
  '/layouts/SuperAdminLayout.tsx',
  
  // Common Components
  '/components/layout/Header.tsx',
  '/components/layout/Sidebar.tsx',
  '/components/ui/Calculator.tsx',
  '/components/ui/ConfirmationModal.tsx',
  '/components/ui/DigitalClock.tsx',
  '/components/ui/Modal.tsx',
  '/components/ui/NetworkStatusIndicator.tsx',
  '/components/ui/NotificationContainer.tsx',
  '/components/ui/ProgressBar.tsx',
  '/components/ui/Skeleton.tsx',
  '/components/ui/SubscriptionWarningBanner.tsx',
  '/components/ui/Table.tsx',
  '/components/ui/Tabs.tsx',
  '/components/ui/ToggleSwitch.tsx',

  // Pages & their components
  '/pages/ActivityLogPage.tsx',
  '/pages/AutomationsPage.tsx',
  '/components/automations/JobModal.tsx',
  '/pages/BranchManagementPage.tsx',
  '/pages/ContentPage.tsx',
  '/pages/CreditManagementPage.tsx',
  '/pages/DashboardPage.tsx',
  '/components/dashboard/AddWidgetModal.tsx',
  '/components/dashboard/BranchPerformanceChart.tsx',
  '/components/dashboard/CashierSalesDetailModal.tsx',
  '/components/dashboard/DashboardCard.tsx',
  '/components/dashboard/RecentSalesTable.tsx',
  '/components/dashboard/ReturnApprovalModal.tsx',
  '/components/dashboard/SalesChart.tsx',
  '/components/dashboard/TopProductsChart.tsx',
  '/pages/InvoicingPage.tsx',
  '/components/invoicing/InvoiceViewModal.tsx',
  '/pages/LandingPage.tsx',
  '/components/landing/FaqSection.tsx',
  '/components/landing/FeaturesSection.tsx',
  '/components/landing/Footer.tsx',
  '/components/landing/HeroSection.tsx',
  '/components/landing/LandingNavbar.tsx',
  '/components/landing/PricingSection.tsx',
  '/components/landing/TestimonialsSection.tsx',
  '/pages/LogisticsPage.tsx',
  '/pages/logistics/ConsignmentsPage.tsx',
  '/components/logistics/ConsignmentFormModal.tsx',
  '/components/logistics/Waybill.tsx',
  '/components/logistics/WaybillModal.tsx',
  '/pages/logistics/FleetPage.tsx',
  '/pages/MaintenancePage.tsx',
  '/pages/PosPage.tsx',
  '/components/pos/BarcodeScannerModal.tsx',
  '/components/pos/Cart.tsx',
  '/components/pos/ChargeToCustomerModal.tsx',
  '/components/pos/CustomerFormModal.tsx',
  '/components/pos/HeldSalesModal.tsx',
  '/components/pos/PaymentModal.tsx',
  '/components/pos/ProductCard.tsx',
  '/components/pos/ProductDetailsModal.tsx',
  '/components/pos/Receipt.tsx',
  '/components/pos/ReturnModal.tsx',
  '/components/pos/SaleSuccessModal.tsx',
  '/pages/SettingsPage.tsx',
  '/pages/settings/AccessControlPage.tsx',
  '/components/settings/CurrentPlanCard.tsx',
  '/components/settings/PaymentHistoryTable.tsx',
  '/components/settings/PaymentMethodCard.tsx',
  '/components/settings/PlanComparison.tsx',
  '/components/settings/RecurringPaymentModal.tsx',
  '/components/settings/UpgradeModal.tsx',
  '/pages/settings/IntegrationsPage.tsx',
  '/pages/settings/ManageBillingPage.tsx',
  '/pages/settings/NotificationsPage.tsx',
  '/pages/settings/PaymentHistoryPage.tsx',
  '/pages/settings/ProfilePage.tsx',
  '/pages/settings/SecurityPage.tsx',
  '/pages/settings/ViewSubscriptionDetailsPage.tsx',
  '/pages/StaffManagementPage.tsx',
  '/components/tenant/TenantRoleModal.tsx',
  
  // Inventory Sub-pages & components
  '/pages/InventoryPage.tsx',
  '/components/inventory/BulkUpdateModal.tsx',
  '/components/inventory/ProductForm.tsx',
  '/components/inventory/PurchaseOrderModal.tsx',
  '/components/inventory/ReceivePOModal.tsx',
  '/components/inventory/StockAdjustmentModal.tsx',
  '/components/inventory/StockCountModal.tsx',
  '/components/inventory/StockTransferModal.tsx',
  '/components/inventory/SupplierModal.tsx',
  '/pages/inventory/InventoryHistoryPage.tsx',
  '/pages/inventory/PurchaseOrdersPage.tsx',
  '/pages/inventory/StockCountsPage.tsx',
  '/pages/inventory/StockTransfersPage.tsx',
  '/pages/inventory/SuppliersPage.tsx',

  // Accounting Sub-pages & components
  '/pages/AccountingPage.tsx',
  '/components/accounting/DetailedSalesReport.tsx',
  
  // Auth Pages
  '/pages/auth/ForgotPasswordPage.tsx',
  '/pages/auth/LoginPage.tsx',
  '/pages/auth/TenantSignupPage.tsx',

  // Super Admin Pages & Components
  '/pages/superadmin/AccessControlPage.tsx',
  '/pages/superadmin/AnnouncementsPage.tsx',
  '/components/superadmin/AnnouncementModal.tsx',
  '/pages/superadmin/AppManagementPage.tsx',
  '/pages/superadmin/CronJobsPage.tsx',
  '/pages/superadmin/FeatureControlPage.tsx',
  '/pages/superadmin/PaymentsPage.tsx',
  '/pages/superadmin/ProfilePage.tsx',
  '/pages/superadmin/SubscriptionsPage.tsx',
  '/components/superadmin/SubscriptionPlanModal.tsx',
  '/pages/superadmin/SuperAdminDashboardPage.tsx',
  '/components/superadmin/SuperAdminHeader.tsx',
  '/components/superadmin/SuperAdminRoleModal.tsx',
  '/components/superadmin/SuperAdminSidebar.tsx',
  '/components/superadmin/SuperAdminStaffModal.tsx',
  '/pages/superadmin/SystemSettingsPage.tsx',
  '/pages/superadmin/TeamManagementPage.tsx',
  '/pages/superadmin/TenantActivityLogPage.tsx',
  '/pages/superadmin/TenantsPage.tsx',
  '/pages/superadmin/TemplatesPage.tsx',
  '/components/superadmin/TemplateEditor.tsx',
  
  // External CDNs
  'https://cdn.tailwindcss.com',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
  'https://unpkg.com/clsx@1.2.1/dist/clsx.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.8.2/jspdf-autotable.min.js',
  'https://aistudiocdn.com/@google/genai@^0.23.0',
  'https://aistudiocdn.com/@supabase/supabase-js@^2.45.0',
  'https://aistudiocdn.com/recharts@^3.3.0',
  'https://aistudiocdn.com/react@^19.2.0',
  'https://aistudiocdn.com/react@^19.2.0/jsx-runtime',
  'https://aistudiocdn.com/react-dom@^19.2.0/client',
  'https://aistudiocdn.com/lucide-react@^0.552.0',
  'https://aistudiocdn.com/react-router-dom@^6.25.1',
];

// Install event: Cache static assets.
self.addEventListener('install', event => {
  console.log('[SW] Install');
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then(cache => {
        console.log('[SW] Precaching static assets');
        // Use addAll with a catch to prevent installation failure if one asset fails.
        // Removed `no-cors` as it's not suitable for these CDN assets which support CORS.
        return cache.addAll(STATIC_ASSETS).catch(error => {
          console.error('[SW] Failed to precache some static assets:', error);
        });
      })
  );
  self.skipWaiting();
});

// Activate event: Clean up old caches.
self.addEventListener('activate', event => {
  console.log('[SW] Activate');
  const cacheWhitelist = [STATIC_CACHE_NAME, DATA_CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (!cacheWhitelist.includes(cacheName)) {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

// Fetch event: Apply caching strategies.
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Ignore non-GET requests and browser extension requests
  if (request.method !== 'GET' || request.url.startsWith('chrome-extension://')) {
    return;
  }
  
  // Strategy 1: API calls (Network First, then Cache)
  // This ensures data is fresh but available offline.
  if (url.pathname.startsWith(API_URL_PART)) {
    event.respondWith(
      fetch(request)
        .then(networkResponse => {
          // Check if we received a valid response
          if (networkResponse && networkResponse.status === 200) {
            const responseToCache = networkResponse.clone();
            caches.open(DATA_CACHE_NAME).then(cache => {
              cache.put(request, responseToCache);
            });
          }
          return networkResponse;
        })
        .catch(() => {
          console.log(`[SW] Network failed for API call: ${request.url}. Serving from cache.`);
          // If network fails, try to serve from cache.
          return caches.match(request).then(response => {
            return response || new Response(JSON.stringify({ error: "Offline: Could not fetch data." }), { headers: { 'Content-Type': 'application/json' }});
          });
        })
    );
    return;
  }

  // Strategy 2: Static Assets (Cache First, then Network)
  // Ideal for app shell, fonts, scripts, and styles.
  event.respondWith(
    caches.match(request)
      .then(cachedResponse => {
        // Return from cache if found.
        if (cachedResponse) {
          return cachedResponse;
        }

        // Otherwise, fetch from network, cache, and return.
        return fetch(request).then(networkResponse => {
           if (networkResponse && networkResponse.status === 200) {
            const responseToCache = networkResponse.clone();
            caches.open(STATIC_CACHE_NAME).then(cache => {
              cache.put(request, responseToCache);
            });
          }
          return networkResponse;
        }).catch(error => {
            console.error('[SW] Fetch failed for static asset:', request.url, error);
            // Optionally, return a fallback page/asset here
        });
      })
  );
});