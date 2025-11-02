

import { Session } from '@supabase/supabase-js';

export interface Sale {
  id: string;
  customerName: string;
  customerId?: string; // Optional customer ID
  cashierName: string;
  date: string;
  amount: number;
  status: 'Paid' | 'Pending' | 'Refunded' | 'Credit';
  branch: string;
  items: CartItem[];
  payments: Payment[];
}

// NEW type for product variants
export interface ProductVariant {
    id: string; // Unique ID for this variant, e.g., prod_123_1
    sku: string;
    price: number;
    costPrice: number;
    stockByBranch: { [branchId: string]: number };
    lowStockThreshold: number;
    options: { [optionName: string]: string }; // e.g., { "Size": "Small", "Color": "Red" }
}

// MODIFIED Product type
export interface Product {
    id: string;
    name: string;
    category: string;
    supplier: string;
    imageUrl: string;
    isFavorite?: boolean;
    
    // Defines the structure of variants, e.g., [{ name: "Size", values: ["S", "M"] }]
    variantOptions: { name: string; values: string[] }[]; 
    
    // The list of actual sellable items. For simple products, this has one entry.
    variants: ProductVariant[];
}


// MODIFIED CartItem type
export interface CartItem {
    id: string; // This will be the variantId for uniqueness in the cart
    productId: string; // ID of parent product
    name: string; // Combined name, e.g., "T-Shirt - Small, Red"
    sku: string;
    price: number;
    costPrice: number;
    imageUrl: string;
    quantity: number;
    discount?: number;
    stock: number; // Stock of this variant in current branch
}


export interface HeldSale {
  id: string;
  items: CartItem[];
  timestamp: number;
  total: number;
}

export interface SalesDataPoint {
  name: string;
  sales: number;
}

export interface BranchPerformance {
    name: string;
    value: number;
}

// Tenant Type
export interface Tenant {
  id: string;
  companyName: string;
  email: string;
  plan: string;
  status: 'active' | 'suspended';
  joinedDate: string;
  subscriptionExpires?: string;
}

// NEW - Type for enabled modules
export type ModuleId = 'dashboard' | 'pos' | 'inventory' | 'logistics' | 'branches' | 'staff' | 'automations' | 'invoicing' | 'credit_management' | 'activityLog' | 'reports';

// Billing and Subscription Types
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
  planId: 'basic' | 'pro' | 'premium';
  status: 'active' | 'trial' | 'cancelled';
  trialEnds: string | null;
  nextBillingDate?: string;
  currentUsers: number;
  currentBranches: number;
  billingCycle: 'monthly' | 'yearly';
  recurringPayment: {
      enabled: boolean;
      paymentMethodId?: string;
  };
  paymentMethod?: {
      id: string;
      type: 'card';
      last4: string;
      expiryMonth: number;
      expiryYear: number;
      brand: string;
  };
}

export interface PaymentHistory {
  id: string;
  date: string;
  description: string;
  amount: number;
  status: 'Paid' | 'Failed' | 'Pending';
}

// NEW - For Super Admin Subscriptions Page
export interface ActiveSubscription {
    // FIX: Add id property to be compatible with the generic Table component which requires an id for keys.
    id: string;
    tenantId: string;
    tenantName: string;
    planName: string;
    status: 'active' | 'trial' | 'expired';
    mrr: number;
    nextBillingDate: string | null;
}

// Logistics Types

export interface Truck {
  id: string;
  licensePlate: string;
  model: string;
  capacity: number; // in kg
  status: 'Idle' | 'Loading' | 'On Route' | 'Maintenance';
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
  status: 'Pending' | 'Dispatched' | 'In Transit' | 'Delivered' | 'Sold';
  dispatchDate: string | null;
  deliveryDate: string | null;
  waybillId?: string;
  invoiceId?: string;
  soldToCustomerId?: string;
  notes?: string;
}

export interface Delivery {
  id: string;
  orderId: string;
  customerName: string;
  destination: string;
  driverId: string;
  status: 'Pending' | 'In Transit' | 'Delayed' | 'Delivered';
}


// System Settings & Payment Gateway Types
export type PaymentGatewayId = 'stripe' | 'paypal' | 'paystack' | 'flutterwave' | 'monnify' | 'wise' | 'googlepay' | 'payoneer' | '2checkout' | 'manual';

export interface PaymentGateway {
  id: PaymentGatewayId;
  name: string;
  enabled: boolean;
  apiKey: string;
  secretKey: string;
  webhookUrl: string;
}

export interface EmailSettings {
  provider: 'smtp' | 'resend';
  apiKey?: string; // For Resend
  host?: string;
  port?: number;
  user?: string;
  pass?: string;
}

export interface NotificationService {
  twilioSid: string;
  twilioToken: string;
  oneSignalAppId: string;
  oneSignalApiKey: string;
  firebaseServerKey: string;
}

export type TrackerProvider = 'teltonika' | 'ruptela' | 'queclink' | 'calamp' | 'meitrack' | 'manual';

export interface TrackerIntegrationSettings {
  provider: TrackerProvider;
  enableWeightSensors: boolean;
  apiUrl: string;
  apiKey: string;
}


export interface LandingNavItem {
  name: string;
  href: string;
}

export interface Testimonial {
  quote: string;
  name: string;
  title: string;
  avatar: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface FooterLink {
    name: string;
    href: string;
}
export interface FooterLinkSection {
    title: string;
    links: FooterLink[];
}
export interface BrandingSettings {
  platformName: string;
  logoUrl: string;
  faviconUrl: string;
  
  // Landing Page Content
  landingNavItems: LandingNavItem[];
  signInButtonText: string;
  mainCtaText: string;
  mobileMenuCtaText: string;
  mobileMenuExistingCustomerText: string;

  heroTitle: string;
  heroSubtitle: string;
  heroMainCtaText: string;
  heroSecondaryCtaText: string;
  heroStats: {
      value: string;
      label: string;
  }[];

  featuresSectionTitle: string;
  featuresSectionSubtitle: string;
  features: {
    icon: string;
    title: string;
    description: string;
  }[];

  pricingSectionTitle: string;
  pricingSectionSubtitle: string;
  popularPlanBadgeText: string;
  contactSalesButtonText: string;

  testimonialsSectionTitle: string;
  testimonialsSectionSubtitle: string;
  testimonials: Testimonial[];
  
  faqSectionTitle: string;
  faqSectionSubtitle: string;
  faqItems: FaqItem[];
  
  mobileAppSectionTitle: string;
  mobileAppSectionSubtitle: string;

  footerDescription: string;
  footerLinkSections: FooterLinkSection[];
}

export interface IpGeolocationSettings {
    provider: 'ip-api' | 'ipinfo';
    apiKey?: string;
}

// NEW - Mobile App Settings
export interface MobileAppSettings {
  enabled: boolean;
  forceUpdate: boolean;
  minVersionAndroid: string;
  minVersionIos: string;
  storeUrlAndroid: string;
  storeUrlIos: string;
  maintenanceMode: boolean;
  maintenanceMessage: string;
  // New properties for direct uploads
  androidFileName?: string;
  androidFileSize?: number; // in bytes
  androidLastUpdated?: string; // ISO string
  iosFileName?: string;
  iosFileSize?: number;
  iosLastUpdated?: string;
  appLogoUrl?: string;
  splashScreenUrl?: string;
}

export interface SystemSettings {
  id: number;
  isMaintenanceMode: boolean;
  maintenanceMessage: string;
  inactivityLogoutTimer: number; // in minutes
  paymentGateways: PaymentGateway[];
  email: EmailSettings,
  notifications: NotificationService;
  ipGeolocation: IpGeolocationSettings;
  branding: BrandingSettings;
  mobileApp: MobileAppSettings;
  footerCredits: string;
  termsUrl: string;
  privacyUrl: string;
  refundUrl: string;
  supabaseUrl?: string;
  supabaseAnonKey?: string;
  supabaseBucket?: string;
  isSupabaseConfigured?: boolean;
}

export interface TenantSettings {
    id: string;
    tenantId: string;
    trackerIntegration: TrackerIntegrationSettings;
    inactivityLogoutTimer?: number; // Tenant-specific override in minutes
}

// Branch Type
export interface Branch {
  id: string;
  name: string;
  address: string;
  phone: string;
  managerIds: string[];
  status: 'active' | 'inactive';
}

// Staff Type
export interface Staff {
  id: string;
  name: string;
  email: string;
  username: string;
  password?: string;
  roleId: string;
  branch: string; // branch name
  status: 'active' | 'on-leave';
}

// NEW - Tenant Roles & Permissions
export type TenantPermission =
  | 'manage_pos'
  | 'manage_inventory'
  | 'manage_staff'
  | 'manage_branches'
  | 'manage_automations'
  | 'view_accounting'
  | 'process_returns'
  | 'access_settings';

export interface TenantRole {
    id: string;
    name: string;
    permissions: TenantPermission[];
}

// Invoice Type
export interface Invoice {
  id: string;
  customerName: string;
  issueDate: string;
  dueDate: string;
  amount: number;
  status: 'Paid' | 'Due' | 'Overdue';
}

// New Type for Payments within a sale
export interface Payment {
  method: 'Cash' | 'Card' | 'Transfer' | 'Credit';
  amount: number;
}

// New Type for Customers with credit
export interface Customer {
    id: string;
    name: string;
    email?: string;
    phone?: string;
    creditBalance: number;
}

// New Type for Credit Transactions
export interface CreditTransaction {
    id: string;
    customerId: string;
    date: string;
    type: 'Sale' | 'Payment';
    amount: number; // Positive for sale, negative for payment
    saleId?: string;
}

// New Type for Activity Logs
export interface ActivityLog {
    id: string;
    tenantId: string;
    timestamp: string;
    user: string;
    userRole: 'Admin' | 'Manager' | 'Cashier';
    action: string;
    details: string;
    branch: string;
}

// NEW - Revised Type for Inventory Adjustment Logging (replaces old simple one)
export interface InventoryAdjustmentLogItem {
  productId: string;
  productName: string;
  change: number; // e.g., +10 or -5
}

export type InventoryAdjustmentLogType = 
  | 'Manual Adjustment' | 
  | 'Purchase Order Receipt' | 
  | 'Sale Return' | 
  | 'Stock Count' | 
  | 'Stock Transfer Out' | 
  | 'Stock Transfer In';

export interface InventoryAdjustmentLog {
    id: string;
    timestamp: string;
    user: string;
    branchId: string;
    type: InventoryAdjustmentLogType;
    referenceId?: string; // PO number, Sale ID, Stock Count ID, etc.
    items: InventoryAdjustmentLogItem[];
}


// New Types for Purchase Orders
export interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  paymentTerms: string; // e.g., 'Net 30', 'Due on Receipt'
}

export interface PurchaseOrderItem {
  productId: string; // This will now be the variantId
  name: string; // denormalized for easy display
  sku: string; // denormalized
  quantity: number;
  costPrice: number; // Cost per item for this specific PO
  quantityReceived?: number;
}

export interface PurchaseOrder {
  id: string; // e.g., 'PO-2024-001'
  supplierId: string;
  supplierName: string; // denormalized
  deliveryBranchId: string;
  createdDate: string;
  expectedDate: string;
  status: 'Pending' | 'Partial' | 'Received' | 'Cancelled';
  items: PurchaseOrderItem[];
  notes?: string;
  totalCost: number;
}

// New Types for Stock Counts
export interface StockCountItem {
  productId: string; // parent product ID
  productName: string; // denormalized variant name
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

// New Type for Stock Transfers
export interface StockTransfer {
    id: string;
    fromBranchId: string;
    toBranchId: string;
    createdDate: string;
    completedDate?: string;
    status: 'Pending' | 'In Transit' | 'Completed';
    items: {
        variantId: string;
        quantity: number;
    }[];
    notes?: string;
}

// NEW - Notification Type
export interface Notification {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  duration?: number;
}

// SUPER ADMIN - Platform Management Types

export interface ImpersonationState {
    active: boolean;
    originalSession: Session | null;
    targetName: string | null;
    returnPath: string;
}

export interface PlatformPayment {
    id: string;
    tenantId: string;
    tenantName: string;
    amount: number;
    plan: string;
    gateway: PaymentGatewayId;
    transactionId: string;
    date: string;
    status: 'Success' | 'Failed' | 'Refunded';
}

export interface Announcement {
    id: string;
    title: string;
    content: string;
    type: 'info' | 'warning' | 'success';
    publishDate: string;
    status: 'draft' | 'published';
}

export interface SuperAdminStaff {
    id: string;
    name: string;
    email: string;
    password?: string;
    roleId: string;
    status: 'active' | 'disabled';
}

export type Permission = 
  | 'manage_tenants' 
  | 'manage_billing' 
  | 'manage_payments'
  | 'system_settings' 
  | 'manage_team'
  | 'view_reports'
  | 'post_announcements';

export interface SuperAdminRole {
    id: string;
    name: string;
    permissions: Permission[];
}

export interface EmailSmsTemplate {
    id: string;
    name: string;
    subject?: string; // For email
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

// NEW - Tenant Automations/Scheduled Jobs
export type ScheduledJobTaskType = 'email_report' | 'low_stock_alert' | 'data_backup' | 'credit_reminder';

export interface ScheduledJobConfig {
  recipientEmail?: string;
  reportType?: 'daily_sales' | 'inventory_summary';
  attachmentFormat?: 'csv' | 'pdf';
  backupLocation?: 's3_bucket' | 'google_drive' | 'local_storage';
  backupFormat?: 'json' | 'csv' | 'sql';
}

export interface ScheduledJob {
  id: string;
  tenantId: string;
  name: string;
  taskType: ScheduledJobTaskType;
  schedule: string; // cron string
  lastRun: string | null;
  nextRun: string;
  status: 'active' | 'paused' | 'error';
  config: ScheduledJobConfig;
}

// NEW - Super Admin Access Control
export type BlockRuleType = 'ip' | 'country' | 'region' | 'os' | 'browser' | 'device_type';

export interface BlockRule {
  id: string;
  type: BlockRuleType;
  value: string; // e.g., '192.168.1.1', 'China', 'Android', 'Chrome'
  reason: string;
  createdAt: string;
  expiresAt?: string;
}

// NEW - Tenant Device Access Control
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
