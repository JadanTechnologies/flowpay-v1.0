

// Basic types
export type Language = 'en' | 'es' | 'fr';
export type Currency = 'USD' | 'EUR' | 'NGN';

// From `components/landing/FaqSection.tsx`
export interface FaqItem {
  question: string;
  answer: string;
}

// From `AppContext.tsx`
export interface Notification {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  duration?: number;
}
export type UserRole = 'Admin' | 'Manager' | 'Accountant' | 'Cashier' | 'super_admin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  tenantId?: string;
}

export interface Session {
  access_token: string;
  token_type: string;
  user: User;
}

// From `App.tsx` and other places
export type ModuleId =
  | 'dashboard'
  | 'pos'
  | 'inventory'
  | 'logistics'
  | 'branches'
  | 'staff'
  | 'automations'
  | 'invoicing'
  | 'credit_management'
  | 'activityLog'
  | 'reports';

export type TenantPermission =
  | 'manage_pos'
  | 'manage_inventory'
  | 'manage_staff'
  | 'manage_branches'
  | 'view_reports'
  | 'access_settings'
  | 'manage_logistics'
  | 'manage_invoicing'
  | 'manage_credit'
  | 'view_activity_log'
  | 'manage_automations'
  | 'process_returns';

// Sales and POS
export interface SalesDataPoint {
  name: string;
  sales: number;
}

export interface ProductVariant {
  id: string;
  sku: string;
  price: number;
  costPrice: number;
  stockByBranch: Record<string, number>;
  lowStockThreshold: number;
  options: Record<string, string>;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  supplier: string;
  imageUrl: string;
  isFavorite: boolean;
  variantOptions: { name: string; values: string[] }[];
  variants: ProductVariant[];
}

export interface CartItem {
    id: string; // variant id
    productId: string;
    name: string;
    sku: string;
    price: number;
    costPrice: number;
    // FIX: Made imageUrl required as it is always provided and expected. This resolves type predicate errors elsewhere.
    imageUrl: string;
    quantity: number;
    stock: number;
    discount?: number;
}

export interface Payment {
    method: 'Card' | 'Cash' | 'Transfer' | 'Credit';
    amount: number;
}

export interface Sale {
  id: string;
  customerName: string;
  customerId?: string;
  cashierName: string;
  date: string;
  amount: number;
  status: 'Paid' | 'Pending' | 'Refunded' | 'Credit';
  branch: string;
  items: CartItem[];
  payments: Payment[];
}

export interface HeldSale {
  id: string;
  items: CartItem[];
  timestamp: number;
  total: number;
}

export interface PendingReturnRequest {
  id: string;
  timestamp: string;
  cashierId: string;
  cashierName: string;
  branchId: string;
  originalSale: Sale;
  itemsToReturn: CartItem[];
  totalRefundAmount: number;
  status: 'pending' | 'approved' | 'rejected';
}

// Dashboard
export interface BranchPerformance {
  name: string;
  value: number;
}

export type WidgetId = 'totalRevenue' | 'sales' | 'newCustomers' | 'activeBranches' | 'pendingReturns' | 'salesOverview' | 'branchPerformance' | 'recentSales' | 'topProducts';

// Subscriptions & Billing
export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  description: string;
  features: string[];
  branchLimit: number;
  userLimit: number;
  enabledModules: ModuleId[];
}

export interface UserSubscription {
  planId: string;
  status: 'active' | 'trial' | 'cancelled';
  trialEnds: string | null;
  nextBillingDate: string | null;
  currentUsers: number;
  currentBranches: number;
  billingCycle: 'monthly' | 'yearly';
  recurringPayment: {
    enabled: boolean;
    paymentMethodId: string;
  };
  paymentMethod: {
    id: string;
    type: 'card' | 'bank';
    last4: string;
    expiryMonth: number;
    expiryYear: number;
    brand: string;
  } | null;
}

export interface PaymentHistory {
  id: string;
  date: string;
  description: string;
  amount: number;
  status: 'Paid' | 'Failed' | 'Pending';
}

// Tenant data
export interface Branch {
    id: string;
    name: string;
    address: string;
    phone: string;
    managerIds: string[];
    status: 'active' | 'inactive';
}

export interface Staff {
    id: string;
    name: string;
    email: string;
    username: string;
    password?: string;
    roleId: string;
    branch: string;
    status: 'active' | 'inactive' | 'on-leave';
}

export interface TenantRole {
    id: string;
    name: string;
    permissions: TenantPermission[];
}

export interface Customer {
    id: string;
    name: string;
    email?: string;
    phone?: string;
    creditBalance: number;
    creditLimit?: number;
}

export interface Invoice {
    id: string;
    customerName: string;
    issueDate: string;
    dueDate: string;
    amount: number;
    status: 'Paid' | 'Due' | 'Overdue';
    isRecurring?: boolean;
    recurringFrequency?: 'weekly' | 'monthly' | 'yearly';
    recurringEndDate?: string;
}

export interface CreditTransaction {
    id: string;
    customerId: string;
    date: string;
    type: 'Sale' | 'Payment' | 'Refund';
    amount: number;
    saleId?: string;
}

export interface ActivityLog {
    id: string;
    tenantId: string;
    timestamp: string;
    user: string;
    userRole: string;
    action: string;
    details: string;
    branch: string;
}

// Inventory
export interface Supplier {
    id: string;
    name: string;
    contactPerson: string;
    email: string;
    phone: string;
    address: string;
    paymentTerms: 'Net 15' | 'Net 30' | 'Net 60' | 'Due on Receipt';
}

export interface PurchaseOrderItem {
    productId: string; // This is the variant ID
    name: string;
    sku: string;
    quantity: number;
    costPrice: number;
    quantityReceived: number;
}

export interface PurchaseOrder {
    id: string;
    supplierId: string;
    supplierName: string;
    deliveryBranchId: string;
    createdDate: string;
    expectedDate: string;
    status: 'Pending' | 'Partial' | 'Received' | 'Cancelled';
    items: PurchaseOrderItem[];
    totalCost: number;
    notes?: string;
}

export interface StockCountItem {
    productId: string;
    productName: string;
    sku: string;
    expectedQuantity: number;
    countedQuantity: number | null;
}

export interface StockCount {
    id: string;
    branchId: string;
    date: string;
    status: 'In Progress' | 'Completed';
    items: StockCountItem[];
    notes?: string;
}

export interface StockTransfer {
    id: string;
    fromBranchId: string;
    toBranchId: string;
    createdDate: string;
    dispatchDate?: string;
    completedDate?: string | null;
    status: 'Pending' | 'In Transit' | 'Completed';
    items: { variantId: string, quantity: number }[];
    notes?: string;
}

export type InventoryAdjustmentLogType = 
    | 'Manual Adjustment'
    | 'Purchase Order Receipt'
    | 'Sale Return'
    | 'Stock Count'
    | 'Stock Transfer In'
    | 'Stock Transfer Out';

export interface InventoryAdjustmentLog {
    id: string;
    timestamp: string;
    user: string;
    branchId: string;
    type: InventoryAdjustmentLogType;
    referenceId: string;
    items: { productId: string; productName: string; change: number }[];
}

// Logistics
export interface Truck {
    id: string;
    licensePlate: string;
    model: string;
    capacity: number;
    status: 'Idle' | 'On Route' | 'Loading' | 'Maintenance';
}

export interface Driver {
    id: string;
    name: string;
    assignedTruckId?: string;
    licenseNumber: string;
    phone: string;
    status: 'Idle' | 'On Route' | 'On Break' | 'In Shop';
}

export interface ConsignmentItem {
    variantId: string;
    quantity: number;
}

export interface Consignment {
    id: string;
    truckId: string;
    driverId: string;
    originBranchId: string;
    destinationAddress: string;
    items: ConsignmentItem[];
    status: 'Pending' | 'In Transit' | 'Delivered' | 'Dispatched' | 'Sold';
    dispatchDate: string | null;
    deliveryDate: string | null;
    notes?: string;
    soldToCustomerId?: string;
    invoiceId?: string;
}

export interface Delivery {
    id: string;
    orderId: string;
    customerName: string;
    destination: string;
    driverId: string;
    status: 'Pending' | 'In Transit' | 'Delivered' | 'Delayed';
}

// Super Admin
export interface Tenant {
  id: string;
  companyName: string;
  email: string;
  plan: string;
  status: 'active' | 'suspended' | 'trial';
  joinedDate: string;
  subscriptionExpires?: string;
}

export interface ActiveSubscription {
    id: string;
    tenantId: string;
    tenantName: string;
    planName: string;
    status: 'active' | 'trial' | 'expired';
    mrr: number;
    nextBillingDate: string;
}

export type PaymentGatewayId = 'stripe' | 'paypal' | 'paystack' | 'flutterwave' | 'manual' | '2checkout' | 'googlepay' | 'monnify' | 'wise' | 'payoneer';

export interface PaymentGateway {
    id: PaymentGatewayId;
    name: string;
    enabled: boolean;
    apiKey: string;
    secretKey: string;
    webhookUrl: string;
}

export interface BrandingSettings {
  platformName: string;
  logoUrl: string;
  faviconUrl: string;
  landingNavItems: { name: string; href: string }[];
  signInButtonText: string;
  mainCtaText: string;
  mobileMenuCtaText: string;
  mobileMenuExistingCustomerText: string;
  heroTitle: string;
  heroSubtitle: string;
  heroMainCtaText: string;
  heroSecondaryCtaText: string;
  heroStats: { value: string; label: string }[];
  featuresSectionTitle: string;
  featuresSectionSubtitle: string;
  features: { icon: string; title: string; description: string }[];
  pricingSectionTitle: string;
  pricingSectionSubtitle: string;
  popularPlanBadgeText: string;
  contactSalesButtonText: string;
  testimonialsSectionTitle: string;
  testimonialsSectionSubtitle: string;
  testimonials: { quote: string; name: string; title: string; avatar: string }[];
  faqSectionTitle: string;
  faqSectionSubtitle: string;
  faqItems: FaqItem[];
  mobileAppSectionTitle: string;
  mobileAppSectionSubtitle: string;
  footerDescription: string;
  footerLinkSections: { title: string; links: { name: string; href: string }[] }[];
  aboutUsContent: string;
  blogContent: string;
  contactUsContent: string;
}

export interface SystemSettings {
    id: number;
    isMaintenanceMode: boolean;
    maintenanceMessage: string;
    inactivityLogoutTimer: number;
    paymentGateways: PaymentGateway[];
    email: {
        provider: 'smtp' | 'resend';
        apiKey: string;
        host: string;
        port: number;
        user: string;
        pass: string;
    };
    notifications: {
        twilioSid: string;
        twilioToken: string;
        oneSignalAppId: string;
        oneSignalApiKey: string;
        firebaseServerKey: string;
    };
    ipGeolocation: {
        provider: 'ip-api' | 'ipinfo';
        apiKey: string;
    };
    branding: BrandingSettings;
    featureFlags: Record<ModuleId, boolean>;
    footerCredits: string;
    termsContent: string;
    privacyContent: string;
    refundContent: string;
}

export interface PlatformPayment {
    id: string;
    tenantId: string;
    tenantName: string;
    amount: number;
    plan: string;
    gateway: string;
    transactionId: string;
    date: string;
    status: 'Success' | 'Failed' | 'Refunded';
}

export interface Announcement {
    id: string;
    title: string;
    content: string;
    type: 'info' | 'success' | 'warning';
    publishDate: string;
    status: 'published' | 'draft';
}

export type Permission = 
    | 'manage_tenants' 
    | 'manage_billing' 
    | 'manage_payments' 
    | 'system_settings' 
    | 'manage_team' 
    | 'view_reports' 
    | 'post_announcements';

export interface SuperAdminStaff {
    id: string;
    name: string;
    email: string;
    password?: string;
    roleId: string;
    status: 'active' | 'disabled';
}

export interface SuperAdminRole {
    id: string;
    name: string;
    permissions: Permission[];
}

export interface EmailSmsTemplate {
    id: string;
    name: string;
    subject?: string;
    body: string;
    type: 'email' | 'sms';
}

export interface CronJob {
    id: string;
    name: string;
    description: string;
    schedule: string;
    lastRun: string;
    nextRun: string;
    status: 'OK' | 'Failed' | 'Running';
}

export type ScheduledJobTaskType = 'email_report' | 'low_stock_alert' | 'data_backup' | 'credit_reminder' | 'recurring_invoice';

export interface ScheduledJobConfig {
    recipientEmail?: string;
    reportType?: 'daily_sales' | 'inventory_summary';
    attachmentFormat?: 'csv' | 'pdf';
    backupLocation?: 's3_bucket' | 'google_drive' | 'local_storage';
    backupFormat?: 'json' | 'csv' | 'sql';
    sourceInvoiceId?: string;
}

export interface ScheduledJob {
    id: string;
    tenantId: string;
    name: string;
    taskType: ScheduledJobTaskType;
    schedule: string;
    lastRun: string | null;
    nextRun: string;
    status: 'active' | 'paused' | 'error';
    config: ScheduledJobConfig;
}

export interface BlockRule {
    id: string;
    type: 'ip' | 'country' | 'region' | 'browser' | 'os' | 'device_type';
    value: string;
    reason: string;
    createdAt: string;
}

// Tenant Settings
export interface BusinessProfile {
    companyName: string;
    address: string;
    phone: string;
    email: string;
    logoUrl: string;
    taxId: string;
}

export type TrackerProvider = 'teltonika' | 'ruptela' | 'queclink' | 'calamp' | 'meitrack' | 'manual';

export interface TenantSettings {
    id: string;
    tenantId: string;
    dashboardLayout: WidgetId[];
    // FIX: Added missing property to allow tenant-specific session timeout overrides.
    inactivityLogoutTimer: number;
    trackerIntegration: {
        provider: TrackerProvider;
        enableWeightSensors: boolean;
        apiUrl: string;
        apiKey: string;
    };
    businessProfile: BusinessProfile;
}

export interface Device {
    id: string;
    staffName: string;
    name: string;
    os: string;
    browser: string;
    ipAddress: string;
    lastLogin: string;
    location?: string;
    isp?: string;
}
