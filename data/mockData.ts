

import { Sale, Product as InventoryProduct, SalesDataPoint, BranchPerformance, Product, SubscriptionPlan, UserSubscription, PaymentHistory, SystemSettings, Tenant, Driver, Delivery, Branch, Staff, Invoice, Customer, CreditTransaction, TenantSettings, ActivityLog, Supplier, PurchaseOrder, StockCount, StockTransfer, PlatformPayment, Announcement, SuperAdminStaff, SuperAdminRole, EmailSmsTemplate, CronJob, ScheduledJob, InventoryAdjustmentLog, BlockRule, TenantRole, Device, ActiveSubscription, ProductVariant, CartItem, Truck, Consignment, InvoiceTemplate } from '../types';

export const salesData: SalesDataPoint[] = [
  { name: 'Jan', sales: 4000 },
  { name: 'Feb', sales: 3000 },
  { name: 'Mar', sales: 5000 },
  { name: 'Apr', sales: 4500 },
  { name: 'May', sales: 6000 },
  { name: 'Jun', sales: 5500 },
  { name: 'Jul', sales: 7000 },
  { name: 'Aug', sales: 6500 },
  { name: 'Sep', sales: 7200 },
  { name: 'Oct', sales: 7800 },
  { name: 'Nov', sales: 8500 },
  { name: 'Dec', sales: 9000 },
];

export const topProducts: (ProductVariant & { productName: string, sales: number })[] = [
  { id: 'v-mbp-1', productName: 'MacBook Pro', sku: 'MBP-2023', price: 2499, costPrice: 1800, stockByBranch: { 'br_1': 10, 'br_2': 15, 'br_3': 5 }, lowStockThreshold: 5, sales: 432, options: { Model: "14-inch" } },
  { id: 'v-ip15-1', productName: 'iPhone 15', sku: 'IP15-PRO', price: 1199, costPrice: 850, stockByBranch: { 'br_1': 20, 'br_2': 30, 'br_3': 10 }, lowStockThreshold: 10, sales: 398, options: { Color: "Titanium" } },
  { id: 'v-nike-af1-1', productName: 'Nike Shoes', sku: 'NK-AF1', price: 120, costPrice: 45, stockByBranch: { 'br_1': 50, 'br_2': 100, 'br_3': 25 }, lowStockThreshold: 20, sales: 251, options: { Size: "10" } },
  { id: 'v-coffee-1', productName: 'Coffee Beans', sku: 'CB-ETH-1KG', price: 25, costPrice: 12, stockByBranch: { 'br_1': 30, 'br_2': 50, 'br_3': 40 }, lowStockThreshold: 15, sales: 198, options: {} },
  { id: 'v-chair-1', productName: 'Desk Chair', sku: 'DC-ERG-BLK', price: 350, costPrice: 150, stockByBranch: { 'br_1': 20, 'br_2': 20, 'br_3': 10 }, lowStockThreshold: 5, sales: 150, options: {} },
];

// FIX: Refactored posProducts to use the new Product/ProductVariant structure.
export const posProducts: Product[] = [
  { id: 'pos-1', name: 'Espresso', category: 'Coffee', supplier: 'sup_1', imageUrl: 'https://picsum.photos/seed/espresso/200', isFavorite: true, variantOptions: [], variants: [{ id: 'v-pos-1', sku: 'COF-ESP-SGL', price: 2.50, costPrice: 1.20, stockByBranch: { 'br_1': 100, 'br_2': 50, 'br_3': 75 }, lowStockThreshold: 20, options: {} }] },
  { 
    id: 'pos-2', name: 'Latte', category: 'Coffee', supplier: 'sup_1', imageUrl: 'https://picsum.photos/seed/latte/200', isFavorite: true, 
    variantOptions: [{ name: "Size", values: ["Small", "Medium", "Large"] }], 
    variants: [
      { id: 'v-pos-2-s', sku: 'COF-LAT-SML', price: 3.50, costPrice: 1.50, stockByBranch: { 'br_1': 8, 'br_2': 20, 'br_3': 15 }, lowStockThreshold: 10, options: { Size: "Small"} },
      { id: 'v-pos-2-m', sku: 'COF-LAT-MED', price: 4.00, costPrice: 1.70, stockByBranch: { 'br_1': 50, 'br_2': 40, 'br_3': 30 }, lowStockThreshold: 10, options: { Size: "Medium"} },
      { id: 'v-pos-2-l', sku: 'COF-LAT-LRG', price: 4.50, costPrice: 1.90, stockByBranch: { 'br_1': 40, 'br_2': 30, 'br_3': 20 }, lowStockThreshold: 10, options: { Size: "Large"} },
    ] 
  },
  { id: 'pos-3', name: 'Cappuccino', category: 'Coffee', supplier: 'sup_1', imageUrl: 'https://picsum.photos/seed/cappuccino/200', isFavorite: false, variantOptions: [], variants: [{ id: 'v-pos-3', sku: 'COF-CAP-STD', price: 3.50, costPrice: 1.50, stockByBranch: { 'br_1': 100, 'br_2': 40, 'br_3': 60 }, lowStockThreshold: 10, options: {} }] },
  { id: 'pos-4', name: 'Croissant', category: 'Pastry', supplier: 'sup_2', imageUrl: 'https://picsum.photos/seed/croissant/200', isFavorite: true, variantOptions: [], variants: [{ id: 'v-pos-4', sku: 'PST-CRS-BTR', price: 2.75, costPrice: 0.90, stockByBranch: { 'br_1': 50, 'br_2': 30, 'br_3': 40 }, lowStockThreshold: 10, options: {} }] },
  { id: 'pos-5', name: 'Muffin', category: 'Pastry', supplier: 'sup_2', imageUrl: 'https://picsum.photos/seed/muffin/200', isFavorite: false, variantOptions: [], variants: [{ id: 'v-pos-5', sku: 'PST-MUF-BLB', price: 2.25, costPrice: 0.75, stockByBranch: { 'br_1': 60, 'br_2': 40, 'br_3': 50 }, lowStockThreshold: 10, options: {} }] },
  { id: 'pos-6', name: 'Bagel', category: 'Bakery', supplier: 'sup_2', imageUrl: 'https://picsum.photos/seed/bagel/200', isFavorite: false, variantOptions: [], variants: [{ id: 'v-pos-6', sku: 'BKY-BGL-PLN', price: 3.00, costPrice: 1.00, stockByBranch: { 'br_1': 0, 'br_2': 20, 'br_3': 10 }, lowStockThreshold: 10, options: {} }] },
  { id: 'pos-7', name: 'Iced Tea', category: 'Drinks', supplier: 'sup_3', imageUrl: 'https://picsum.photos/seed/icedtea/200', isFavorite: false, variantOptions: [], variants: [{ id: 'v-pos-7', sku: 'DRK-TEA-ICD', price: 2.00, costPrice: 0.50, stockByBranch: { 'br_1': 80, 'br_2': 100, 'br_3': 90 }, lowStockThreshold: 15, options: {} }] },
  { id: 'pos-8', name: 'Orange Juice', category: 'Drinks', supplier: 'sup_3', imageUrl: 'https://picsum.photos/seed/juice/200', isFavorite: false, variantOptions: [], variants: [{ id: 'v-pos-8', sku: 'DRK-JUC-ORG', price: 3.00, costPrice: 1.10, stockByBranch: { 'br_1': 70, 'br_2': 60, 'br_3': 65 }, lowStockThreshold: 15, options: {} }] },
  { id: 'pos-9', name: 'Sandwich', category: 'Food', supplier: 'sup_1', imageUrl: 'https://picsum.photos/seed/sandwich/200', isFavorite: false, variantOptions: [], variants: [{ id: 'v-pos-9', sku: 'FOD-SND-TRK', price: 6.50, costPrice: 2.50, stockByBranch: { 'br_1': 30, 'br_2': 15, 'br_3': 20 }, lowStockThreshold: 5, options: {} }] },
  { id: 'pos-10', name: 'Salad', category: 'Food', supplier: 'sup_1', imageUrl: 'https://picsum.photos/seed/salad/200', isFavorite: false, variantOptions: [], variants: [{ id: 'v-pos-10', sku: 'FOD-SLD-CSR', price: 7.50, costPrice: 3.00, stockByBranch: { 'br_1': 25, 'br_2': 10, 'br_3': 15 }, lowStockThreshold: 5, options: {} }] },
  { id: 'pos-11', name: 'Bottled Water', category: 'Drinks', supplier: 'sup_3', imageUrl: 'https://picsum.photos/seed/water/200', isFavorite: false, variantOptions: [], variants: [{ id: 'v-pos-11', sku: 'DRK-WTR-BTL', price: 1.50, costPrice: 0.40, stockByBranch: { 'br_1': 150, 'br_2': 200, 'br_3': 175 }, lowStockThreshold: 20, options: {} }] },
  { id: 'pos-12', name: 'Cookie', category: 'Pastry', supplier: 'sup_2', imageUrl: 'https://picsum.photos/seed/cookie/200', isFavorite: false, variantOptions: [], variants: [{ id: 'v-pos-12', sku: 'PST-CKE-CHP', price: 1.75, costPrice: 0.60, stockByBranch: { 'br_1': 90, 'br_2': 100, 'br_3': 95 }, lowStockThreshold: 10, options: {} }] },
];

const createCartItem = (product: Product, variantIndex: number, branchId: string, overrides: Partial<CartItem> = {}): CartItem => {
    const variant = product.variants[variantIndex];
    return {
        id: variant.id,
        productId: product.id,
        name: product.name,
        sku: variant.sku,
        price: variant.price,
        costPrice: variant.costPrice,
        imageUrl: product.imageUrl,
        quantity: 1,
        stock: variant.stockByBranch[branchId] || 0,
        ...overrides,
    };
};

// FIX: Refactored recentSales items to correctly construct CartItem objects from products and variants.
export const recentSales: Sale[] = [
  { id: 'sale_1', customerName: 'Liam Johnson', cashierName: 'Bob Williams', date: '2023-10-26T10:30:00Z', amount: 6.00, status: 'Paid', branch: 'Downtown Central', 
    items: [
      createCartItem(posProducts.find(p => p.id === 'pos-1')!, 0, 'br_1', { quantity: 1 }),
      createCartItem(posProducts.find(p => p.id === 'pos-2')!, 0, 'br_1', { quantity: 1, discount: 0.00 }),
    ], 
    payments: [{ method: 'Card', amount: 6.00 }] 
  },
  { id: 'sale_2', customerName: 'Olivia Smith', cashierName: 'Charlie Brown', date: '2023-10-26T11:45:00Z', amount: 22.50, status: 'Paid', branch: 'Uptown Square', 
    items: [
        createCartItem(posProducts.find(p => p.id === 'pos-9')!, 0, 'br_2', { quantity: 2 }),
        createCartItem(posProducts.find(p => p.id === 'pos-10')!, 0, 'br_2', { quantity: 1 }),
        createCartItem(posProducts.find(p => p.id === 'pos-11')!, 0, 'br_2', { quantity: 1 }),
    ],
    payments: [{ method: 'Cash', amount: 22.50 }] 
  },
  { id: 'sale_3', customerName: 'Noah Williams', cashierName: 'Diana Prince', date: '2023-10-25T09:15:00Z', amount: 3.50, status: 'Pending', branch: 'Westside Mall', items: [ createCartItem(posProducts.find(p => p.id === 'pos-3')!, 0, 'br_3', { quantity: 1 })], payments: [] },
  { id: 'sale_4', customerName: 'Emma Brown', cashierName: 'Bob Williams', date: '2023-10-25T14:00:00Z', amount: 4.50, status: 'Paid', branch: 'Downtown Central', items: [ createCartItem(posProducts.find(p => p.id === 'pos-5')!, 0, 'br_1', { quantity: 2 })], payments: [{ method: 'Bank Transfer', amount: 4.50 }] },
  { id: 'sale_5', customerName: 'Ava Jones', cashierName: 'Charlie Brown', date: '2023-10-24T16:20:00Z', amount: -2.75, status: 'Refunded', branch: 'Uptown Square', items: [createCartItem(posProducts.find(p => p.id === 'pos-4')!, 0, 'br_2', { quantity: 1, price: -2.75 })], payments: [{ method: 'Cash', amount: -2.75 }] },
  { id: 'sale_6', customerId: 'cust_3', cashierName: 'Alice Johnson', customerName: 'Gadget Galaxy', date: '2023-10-25T18:05:00Z', amount: 8.50, status: 'Credit', branch: 'Downtown Central', items: [ createCartItem(posProducts.find(p => p.id === 'pos-7')!, 0, 'br_1'), createCartItem(posProducts.find(p => p.id === 'pos-9')!, 0, 'br_1')], payments: [{ method: 'Credit', amount: 8.50 }] },
];

// Fix: Export `branchPerformance` data for the dashboard pie chart.
export const branchPerformance: BranchPerformance[] = [
  { name: 'Downtown Central', value: 45300 },
  { name: 'Uptown Square', value: 28700 },
  { name: 'Westside Mall', value: 19500 },
];

// Data for Billing and Subscriptions
export const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: 'plan_basic_123',
    name: 'Basic',
    price: 49,
    description: 'For small businesses getting started.',
    features: ['1 Branch', '5 Users', 'POS & Inventory', 'Basic Reporting'],
    branchLimit: 1,
    userLimit: 5,
    enabledModules: ['dashboard', 'pos', 'inventory', 'reports', 'activityLog'],
  },
  {
    id: 'plan_pro_456',
    name: 'Pro',
    price: 99,
    description: 'For growing businesses that need more.',
    features: ['5 Branches', '25 Users', 'Full Accounting', 'Advanced Reporting', 'API Access'],
    branchLimit: 5,
    userLimit: 25,
    enabledModules: ['dashboard', 'pos', 'inventory', 'reports', 'branches', 'staff', 'invoicing', 'credit_management', 'automations', 'logistics', 'activityLog'],
  },
  {
    id: 'plan_premium_789',
    name: 'Premium',
    price: 249,
    description: 'For large enterprises with custom needs.',
    features: ['Unlimited Branches', 'Unlimited Users', 'Logistics & GPS', 'Dedicated Support', 'Custom Integrations'],
    branchLimit: Infinity,
    userLimit: Infinity,
    enabledModules: ['dashboard', 'pos', 'inventory', 'reports', 'branches', 'staff', 'invoicing', 'credit_management', 'automations', 'logistics', 'activityLog'],
  },
];

export const userSubscription: UserSubscription = {
  planId: 'pro',
  status: 'active',
  trialEnds: null,
  nextBillingDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days from now
  currentUsers: 18,
  currentBranches: 3,
  billingCycle: 'monthly',
  recurringPayment: {
    enabled: true,
    paymentMethodId: 'pm_12345'
  },
  paymentMethod: {
    id: 'pm_12345',
    type: 'card',
    last4: '4242',
    expiryMonth: 12,
    expiryYear: 2025,
    brand: 'Visa',
  },
};

export const paymentHistory: PaymentHistory[] = [
  { id: 'ph-1', date: '2023-10-01', description: 'Pro Plan - Monthly', amount: 99.00, status: 'Paid' },
  { id: 'ph-2', date: '2023-09-01', description: 'Pro Plan - Monthly', amount: 99.00, status: 'Paid' },
  { id: 'ph-3', date: '2023-08-01', description: 'Basic Plan - Monthly', amount: 49.00, status: 'Paid' },
];


// SUPER ADMIN MOCK DATA
export const tenants: Tenant[] = [
    { id: 'tnt_1', companyName: 'Innovate Inc.', email: 'contact@innovate.com', plan: 'Premium', status: 'active', joinedDate: '2023-01-15', subscriptionExpires: '2025-01-15' },
    { id: 'tnt_2', companyName: 'Cornerstone Cafe', email: 'manager@cornerstone.com', plan: 'Pro', status: 'active', joinedDate: '2023-03-22', subscriptionExpires: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] }, // Expires in 5 days
    { id: 'tnt_3', companyName: 'Gadget Galaxy', email: 'support@gadgetgalaxy.com', plan: 'Pro', status: 'suspended', joinedDate: '2023-05-10', subscriptionExpires: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] }, // Expired 10 days ago
    { id: 'tnt_4', companyName: 'Local Blooms', email: 'info@localblooms.com', plan: 'Basic', status: 'active', joinedDate: '2023-06-01', subscriptionExpires: '2024-12-01' },
    { id: 'tnt_5', companyName: 'Global Logistics', email: 'ops@globallogistics.com', plan: 'Premium', status: 'active', joinedDate: '2023-07-19', subscriptionExpires: '2025-07-19' },
    { id: 'tnt_6', companyName: 'The Book Nook', email: 'owner@thebooknook.com', plan: 'Basic', status: 'active', joinedDate: '2023-08-05', subscriptionExpires: '2024-09-05' },
    { id: 'tnt_7', companyName: 'AutoCare Center', email: 'service@autocare.com', plan: 'Pro', status: 'active', joinedDate: '2023-09-12', subscriptionExpires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] }, // Expires in 30 days
];

export const activeSubscriptions: ActiveSubscription[] = [
    { id: 'tnt_1', tenantId: 'tnt_1', tenantName: 'Innovate Inc.', planName: 'Premium', status: 'active', mrr: 249, nextBillingDate: '2025-01-15' },
    { id: 'tnt_2', tenantId: 'tnt_2', tenantName: 'Cornerstone Cafe', planName: 'Pro', status: 'active', mrr: 99, nextBillingDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] },
    { id: 'tnt_3', tenantId: 'tnt_3', tenantName: 'Gadget Galaxy', planName: 'Pro', status: 'expired', mrr: 99, nextBillingDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] },
    { id: 'tnt_4', tenantId: 'tnt_4', tenantName: 'Local Blooms', planName: 'Basic', status: 'active', mrr: 49, nextBillingDate: '2024-12-01' },
    { id: 'new_trial_co', tenantId: 'new_trial_co', tenantName: 'New Trial Co', planName: 'Pro', status: 'trial', mrr: 0, nextBillingDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] }
];

export const platformFinancials = {
    mrr: 123456,
    operationalCosts: 35000,
    netProfit: 88456,
    churnRate: 1.2,
};

export const financialChartData = [
  { name: 'Jan', revenue: 75000, costs: 30000, profit: 45000 },
  { name: 'Feb', revenue: 82000, costs: 31000, profit: 51000 },
  { name: 'Mar', revenue: 95000, costs: 32000, profit: 63000 },
  { name: 'Apr', revenue: 91000, costs: 33000, profit: 58000 },
  { name: 'May', revenue: 110000, costs: 34000, profit: 76000 },
  { name: 'Jun', revenue: 123456, costs: 35000, profit: 88456 },
];

export const tenantGrowthData = [
    { name: 'Jan', tenants: 50 },
    { name: 'Feb', tenants: 55 },
    { name: 'Mar', tenants: 62 },
    { name: 'Apr', tenants: 68 },
    { name: 'May', tenants: 75 },
    { name: 'Jun', tenants: 82 },
];

// Mock data for Logistics
export const trucks: Truck[] = [
    { id: 'TRUCK-01', licensePlate: 'SG 5123 A', model: 'Scania R-series', capacity: 25000, status: 'On Route' },
    { id: 'TRUCK-02', licensePlate: 'SG 9876 B', model: 'Volvo FH', capacity: 25000, status: 'Idle' },
];

export const drivers: Driver[] = [
    { id: 'DRV-01', name: 'John Doe', assignedTruckId: 'TRUCK-01', licenseNumber: 'D1234567', phone: '555-0101', status: 'On Route' },
    { id: 'DRV-02', name: 'Jane Smith', assignedTruckId: 'TRUCK-02', licenseNumber: 'D7654321', phone: '555-0102', status: 'Idle' },
];

export const consignments: Consignment[] = [
  { 
    id: 'CON-001', 
    truckId: 'TRUCK-01',
    driverId: 'DRV-01',
    originBranchId: 'br_1',
    destinationAddress: '123 Customer Ave, Client City',
    items: [ { variantId: 'v-pos-9', quantity: 10 }, { variantId: 'v-pos-10', quantity: 5 } ],
    status: 'In Transit',
    dispatchDate: new Date().toISOString(),
    deliveryDate: null,
  },
  { 
    id: 'CON-002', 
    truckId: 'TRUCK-02',
    driverId: 'DRV-02',
    originBranchId: 'br_2',
    destinationAddress: '456 Business Rd, Corporate Town',
    items: [ { variantId: 'v-pos-2-m', quantity: 20 } ],
    status: 'Pending',
    dispatchDate: null,
    deliveryDate: null,
  }
];

export const deliveries: Delivery[] = [
    { id: 'DEL-01', orderId: 'ORD-123', customerName: 'Innovate Inc.', destination: '123 Tech Park', driverId: 'DRV-01', status: 'In Transit' },
    { id: 'DEL-02', orderId: 'ORD-124', customerName: 'Cornerstone Cafe', destination: '456 Coffee Ave', driverId: 'DRV-02', status: 'Pending' },
    { id: 'DEL-03', orderId: 'ORD-120', customerName: 'Gadget Galaxy', destination: '789 Circuit Board', driverId: 'DRV-01', status: 'Delayed' },
];

// System Settings
export const systemSettings: SystemSettings = {
    id: 1,
    isMaintenanceMode: false,
    maintenanceMessage: "We are currently undergoing scheduled maintenance. We'll be back shortly.",
    inactivityLogoutTimer: 15,
    paymentGateways: [
        { id: 'stripe', name: 'Stripe', enabled: true, apiKey: 'pk_test_...', secretKey: 'sk_test_...', webhookUrl: 'https://api.flowpay.com/webhooks/stripe' },
        { id: 'paypal', name: 'PayPal', enabled: false, apiKey: '...', secretKey: '...', webhookUrl: 'https://api.flowpay.com/webhooks/paypal' },
        { id: 'paystack', name: 'Paystack', enabled: true, apiKey: 'pk_test_...', secretKey: 'sk_test_...', webhookUrl: 'https://api.flowpay.com/webhooks/paystack' },
        { id: 'flutterwave', name: 'Flutterwave', enabled: true, apiKey: 'pk_test_...', secretKey: 'sk_test_...', webhookUrl: 'https://api.flowpay.com/webhooks/flutterwave' },
        { id: 'manual', name: 'Manual / Bank Transfer', enabled: true, apiKey: 'Bank: FlowPay Bank\nAccount: 1234567890\nReference: Your Company Name', secretKey: '', webhookUrl: '' },
    ],
    email: {
        provider: 'resend',
        apiKey: 're_123456789',
        host: '',
        port: 587,
        user: '',
        pass: '',
    },
    notifications: {
        twilioSid: 'AC123...',
        twilioToken: '...',
        oneSignalAppId: '...',
        oneSignalApiKey: '...',
        firebaseServerKey: '...',
    },
    ipGeolocation: {
        provider: 'ip-api',
        apiKey: '',
    },
    branding: {
      platformName: 'FlowPay',
      logoUrl: '',
      faviconUrl: '/vite.svg',
      landingNavItems: [
        { name: 'Features', href: '#features' },
        { name: 'Pricing', href: '#pricing' },
        { name: 'Testimonials', href: '#testimonials' },
        { name: 'FAQ', href: '#faq' },
      ],
      signInButtonText: 'Sign In',
      mainCtaText: 'Get Started',
      mobileMenuCtaText: 'Start Free Trial',
      mobileMenuExistingCustomerText: 'Existing customer?',
      heroTitle: 'The All-In-One <span class="text-primary">POS & Logistics</span> Platform',
      heroSubtitle: 'FlowPay combines Point of Sale, Inventory, Accounting, and GPS Tracking into one seamless, powerful SaaS solution designed for B2B success.',
      heroMainCtaText: 'Start Your 30-Day Free Trial',
      heroSecondaryCtaText: 'Explore Features',
      heroStats: [
          { value: '10,000+', label: 'Active Users' },
          { value: '5M+', label: 'Transactions Processed' },
          { value: '$50M+', label: 'Managed Revenue' },
      ],
      featuresSectionTitle: 'Everything Your Business Needs',
      featuresSectionSubtitle: "FlowPay is more than just a POS. It's a complete ecosystem to manage and grow your business.",
      features: [
        { icon: 'ShoppingCart', title: 'Point of Sale', description: 'Intuitive, fast, and reliable POS for any business. Works online and offline.' },
        { icon: 'Package', title: 'Inventory Management', description: 'Track stock levels across multiple branches, manage suppliers, and automate purchase orders.' },
        { icon: 'BookOpen', title: 'Accounting', description: 'Integrated accounting with real-time reporting, invoicing, and expense tracking.' },
        { icon: 'Truck', title: 'Logistics & GPS', description: 'Manage your fleet, track consignments in real-time, and optimize delivery routes.' },
        { icon: 'Users', title: 'Multi-Tenant & Staff', description: 'Securely manage multiple business tenants or branches with granular staff permissions.' },
        { icon: 'BarChart', title: 'Advanced Reporting', description: 'Get actionable insights into your sales, inventory, and financial performance.' },
      ],
      pricingSectionTitle: 'Flexible Pricing for Teams of Any Size',
      pricingSectionSubtitle: 'Choose a plan that fits your needs. All plans start with a 30-day free trial.',
      popularPlanBadgeText: 'Most Popular',
      contactSalesButtonText: 'Contact Sales',
      testimonialsSectionTitle: 'Loved by Businesses Worldwide',
      testimonialsSectionSubtitle: "Don't just take our word for it. Here's what our customers are saying.",
      testimonials: [
        { quote: "FlowPay revolutionized how we manage our multi-branch retail operations. The inventory management is a lifesaver!", name: 'Sarah L.', title: 'CEO of Innovate Inc.', avatar: 'https://picsum.photos/seed/sarah/100' },
        { quote: "The ability to track our delivery fleet in real-time alongside our POS data is a game-changer for our B2B operations.", name: 'David C.', title: 'Logistics Manager, Global Logistics', avatar: 'https://picsum.photos/seed/david/100' },
        { quote: "As a small cafe, the Pro plan was perfect for us. It's affordable, powerful, and incredibly easy to set up.", name: 'Maria G.', title: 'Owner, Cornerstone Cafe', avatar: 'https://picsum.photos/seed/maria/100' },
      ],
      faqSectionTitle: 'Frequently Asked Questions',
      faqSectionSubtitle: "Have questions? We've got answers. If you can't find what you're looking for, feel free to contact us.",
      faqItems: [
        { question: 'Is there a free trial?', answer: 'Yes, all our plans come with a 30-day free trial. No credit card required to get started.' },
        { question: 'Can I change my plan later?', answer: 'Absolutely! You can upgrade or downgrade your plan at any time from your billing settings.' },
        { question: 'Does FlowPay work offline?', answer: 'Yes, our POS module has offline capabilities. It will sync your sales data automatically once you reconnect to the internet.' },
        { question: 'What kind of support do you offer?', answer: 'We offer email support on all plans. Our Premium plan includes dedicated phone support and a personal account manager.' },
      ],
      mobileAppSectionTitle: 'Manage Your Business On The Go',
      mobileAppSectionSubtitle: 'Our mobile app for iOS and Android lets you view sales, manage inventory, and track your fleet from anywhere.',
      footerDescription: 'The ultimate SaaS platform for POS, Inventory, and Logistics management.',
      footerLinkSections: [
         {
            title: 'Product',
            links: [
                { name: 'Features', href: '#features' },
                { name: 'Pricing', href: '#pricing' },
                { name: 'Integrations', href: '#' },
                { name: 'API Status', href: '#' },
            ]
        },
        {
            title: 'Company',
            links: [
                { name: 'About Us', href: '#' },
                { name: 'Careers', href: '#' },
                { name: 'Blog', href: '#' },
                { name: 'Contact Us', href: '#' },
            ]
        },
      ],
// FIX: Add missing properties to the branding object to match the BrandingSettings type.
aboutUsContent: "This is the About Us page content. It can be edited from the system settings.",
blogContent: "This is the Blog page content. It can be edited from the system settings.",
contactUsContent: "This is the Contact Us page content. It can be edited from the system settings.",
    },
    featureFlags: {
        'dashboard': true,
        'pos': true,
        'inventory': true,
        'logistics': true,
        'branches': true,
        'staff': true,
        'automations': true,
        'invoicing': true,
        'credit_management': true,
        'activityLog': true,
        'reports': true,
    },
    footerCredits: '© 2024 FlowPay Inc. All rights reserved.',
    termsContent: 'This is placeholder content for the Terms of Service. Please replace this with your actual terms.',
    privacyContent: 'This is placeholder content for the Privacy Policy. Please replace this with your actual policy.',
    refundContent: 'This is placeholder content for the Refund Policy. Please replace this with your actual policy.',
};

// Tenant-specific settings
export const tenantSettings: TenantSettings = {
    id: 'ts_1',
    tenantId: 'tnt_1',
    dashboardLayout: [
        'totalRevenue', 
        'sales', 
        'newCustomers', 
        'pendingReturns',
        'activeBranches', 
        'salesOverview', 
        'branchPerformance', 
        'recentSales', 
        'topProducts'
    ],
    // FIX: Added inactivityLogoutTimer to match the updated TenantSettings type.
    inactivityLogoutTimer: 10, // Tenant-specific override (system default is 15)
    trackerIntegration: {
        provider: 'teltonika',
        enableWeightSensors: true,
        apiUrl: 'https://api.teltonika.com',
        apiKey: '...',
    },
    businessProfile: {
      companyName: 'Cornerstone Cafe',
      address: '456 Coffee Ave, Flavor Town',
      phone: '555-0102',
      email: 'manager@cornerstone.com',
      logoUrl: 'https://picsum.photos/seed/logo/200/80',
      taxId: 'VAT-12345678',
    }
};

// Tenant Data
export const branches: Branch[] = [
    { id: 'br_1', name: 'Downtown Central', address: '123 Main St', phone: '555-1234', managerIds: ['stf_2'], status: 'active' },
    { id: 'br_2', name: 'Uptown Square', address: '456 Oak Ave', phone: '555-5678', managerIds: ['stf_3'], status: 'active' },
    { id: 'br_3', name: 'Westside Mall', address: '789 Pine Ln', phone: '555-9012', managerIds: [], status: 'inactive' },
];

export const staff: Staff[] = [
  { id: 'stf_1', name: 'Jadan Admin', email: 'tenantadmin@jadan.com', username: 'jadanadmin', roleId: 'role_admin', branch: 'Downtown Central', status: 'active' },
  { id: 'stf_2', name: 'Jadan Manager', email: 'manager@jadan.com', username: 'jadanmanager', roleId: 'role_manager', branch: 'Downtown Central', status: 'active' },
  { id: 'stf_3', name: 'Jadan Accountant', email: 'accountant@jadan.com', username: 'jadanaccountant', roleId: 'role_accountant', branch: 'Downtown Central', status: 'active' },
  { id: 'stf_4', name: 'Jadan Cashier', email: 'cashier@jadan.com', username: 'jadancashier', roleId: 'role_cashier', branch: 'Downtown Central', status: 'active' },
  { id: 'stf_5', name: 'Alice Johnson', email: 'alice@flowpay.com', username: 'alicej', roleId: 'role_cashier', branch: 'Uptown Square', status: 'on-leave' },
];

export const tenantRoles: TenantRole[] = [
    { id: 'role_admin', name: 'Admin', permissions: ['manage_pos', 'manage_inventory', 'manage_staff', 'manage_branches', 'view_reports', 'access_settings', 'manage_logistics', 'manage_invoicing', 'manage_credit', 'view_activity_log', 'manage_automations', 'process_returns'] },
    { id: 'role_manager', name: 'Manager', permissions: ['manage_pos', 'manage_inventory', 'view_reports', 'process_returns'] },
    { id: 'role_accountant', name: 'Accountant', permissions: ['view_reports', 'manage_invoicing', 'manage_credit', 'view_activity_log'] },
    { id: 'role_cashier', name: 'Cashier', permissions: ['manage_pos', 'process_returns'] },
];

export const invoices: Invoice[] = [
    { id: 'inv_1001', customerId: 'cust_1', customerName: 'Innovate Inc.', issueDate: '2023-10-15', dueDate: '2023-11-14', amount: 1200.00, status: 'Paid', isRecurring: true, recurringFrequency: 'monthly', recurringEndDate: '2024-10-01', items: [{ description: 'Monthly Retainer', quantity: 1, unitPrice: 1200 }], notes: 'Thank you for your continued partnership.' },
    { id: 'inv_1002', customerId: 'cust_2', customerName: 'Local Blooms', issueDate: '2023-10-20', dueDate: '2023-11-19', amount: 750.50, status: 'Due', items: [{ description: 'Website Development', quantity: 1, unitPrice: 750.50 }], notes: '' },
    { id: 'inv_1003', customerId: 'cust_3', customerName: 'Gadget Galaxy', issueDate: '2023-09-05', dueDate: '2023-10-05', amount: 450.00, status: 'Overdue', items: [{ description: 'Hardware Repair', quantity: 3, unitPrice: 150 }], notes: 'Payment is overdue.' },
];

export const customers: Customer[] = [
    { id: 'cust_1', name: 'Innovate Inc.', email: 'accounts@innovate.com', phone: '555-1111', creditBalance: 0, creditLimit: 5000 },
    { id: 'cust_2', name: 'Local Blooms', email: 'flowers@localblooms.com', phone: '555-2222', creditBalance: 0, creditLimit: 1000 },
    { id: 'cust_3', name: 'Gadget Galaxy', email: 'support@gadgetgalaxy.com', phone: '555-3333', creditBalance: 8.50, creditLimit: 200 },
    { id: 'cust_4', name: 'Walk-in Customer', creditBalance: 0 },
];

export const creditTransactions: CreditTransaction[] = [
    { id: 'ctx_1', customerId: 'cust_3', date: '2023-10-25', type: 'Sale', amount: 8.50, saleId: 'sale_6' },
    { id: 'ctx_2', customerId: 'cust_1', date: '2023-10-22', type: 'Sale', amount: 250, saleId: 'sale_7' },
    { id: 'ctx_3', customerId: 'cust_1', date: '2023-10-28', type: 'Payment', amount: -250 },
];

export const activityLogs: ActivityLog[] = [
    { id: 'log_1', tenantId: 'tnt_2', timestamp: '2023-10-26T10:30:00Z', user: 'Bob Williams', userRole: 'Manager', action: 'Completed Sale', details: 'Sale ID: sale_1, Amount: $6.00', branch: 'Downtown Central' },
    { id: 'log_2', tenantId: 'tnt_2', timestamp: '2023-10-26T09:05:00Z', user: 'Admin User', userRole: 'Admin', action: 'Updated Product', details: 'Product: Latte, Price changed to $3.50', branch: 'Downtown Central' },
    { id: 'log_3', tenantId: 'tnt_2', timestamp: '2023-10-25T14:02:00Z', user: 'Bob Williams', userRole: 'Manager', action: 'Processed Refund', details: 'Sale ID: sale_5, Amount: $2.75', branch: 'Downtown Central' },
    { id: 'log_4', tenantId: 'tnt_3', timestamp: '2023-10-25T18:05:00Z', user: 'Alice Johnson', userRole: 'Cashier', action: 'Sale on Credit', details: 'Sale ID: sale_6, Amount: $8.50 to Gadget Galaxy', branch: 'Downtown Central' },
];

export const inventoryAdjustmentLogs: InventoryAdjustmentLog[] = [
  { id: 'adj_1', timestamp: new Date().toISOString(), user: 'Admin User', branchId: 'br_1', type: 'Manual Adjustment', referenceId: 'Damaged Goods', items: [{ productId: 'pos-2', productName: 'Latte', change: -2 }] },
  { id: 'adj_2', timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), user: 'System', branchId: 'br_2', type: 'Purchase Order Receipt', referenceId: 'PO-2023-001', items: [{ productId: 'pos-1', productName: 'Espresso', change: 50 }] },
  { id: 'adj_3', timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), user: 'Charlie Brown', branchId: 'br_2', type: 'Sale Return', referenceId: 'sale_5', items: [{ productId: 'pos-4', productName: 'Croissant', change: 1 }] },
];


// Inventory Sub-modules
export const suppliers: Supplier[] = [
  { id: 'sup_1', name: 'Global Coffee Co.', contactPerson: 'John Bean', email: 'sales@globalcoffee.com', phone: '555-1001', address: '1 Coffee Way', paymentTerms: 'Net 30' },
  { id: 'sup_2', name: 'Fresh Pastries Inc.', contactPerson: 'Jane Dough', email: 'orders@freshpastries.com', phone: '555-1002', address: '2 Bakery Lane', paymentTerms: 'Due on Receipt' },
  { id: 'sup_3', name: 'Pure Beverages Ltd.', contactPerson: 'Sam Water', email: 'contact@purebev.com', phone: '555-1003', address: '3 Aqua Drive', paymentTerms: 'Net 15' },
];

export const purchaseOrders: PurchaseOrder[] = [
    { id: 'PO-2023-001', supplierId: 'sup_1', supplierName: 'Global Coffee Co.', deliveryBranchId: 'br_1', createdDate: '2023-10-15', expectedDate: '2023-10-25', status: 'Received', items: [{ productId: 'v-pos-1', name: 'Espresso', sku: 'COF-ESP-SGL', quantity: 100, costPrice: 1.10, quantityReceived: 100 }], totalCost: 110.00 },
    { id: 'PO-2023-002', supplierId: 'sup_2', supplierName: 'Fresh Pastries Inc.', deliveryBranchId: 'br_2', createdDate: '2023-10-20', expectedDate: '2023-10-28', status: 'Partial', items: [{ productId: 'v-pos-4', name: 'Croissant', sku: 'PST-CRS-BTR', quantity: 50, costPrice: 0.85, quantityReceived: 25 }], totalCost: 42.50 },
    // FIX: Added missing 'quantityReceived' property to satisfy the PurchaseOrderItem type.
    { id: 'PO-2023-003', supplierId: 'sup_1', supplierName: 'Global Coffee Co.', deliveryBranchId: 'br_1', createdDate: '2023-10-26', expectedDate: '2023-11-05', status: 'Pending', items: [{ productId: 'v-pos-2-m', name: 'Latte - Medium', sku: 'COF-LAT-MED', quantity: 50, costPrice: 1.60, quantityReceived: 0 }], totalCost: 80.00 },
];

export const stockCounts: StockCount[] = [
    { id: 'SC-2023-001', branchId: 'br_1', date: '2023-09-30', status: 'Completed', items: [{ productId: 'pos-1', productName: 'Espresso', sku: 'COF-ESP-SGL', expectedQuantity: 105, countedQuantity: 102 }] },
    { id: 'SC-2023-002', branchId: 'br_2', date: '2023-10-25', status: 'In Progress', items: [{ productId: 'pos-4', productName: 'Croissant', sku: 'PST-CRS-BTR', expectedQuantity: 30, countedQuantity: null }] },
];

export const stockTransfers: StockTransfer[] = [
  { id: 'ST-001', fromBranchId: 'br_1', toBranchId: 'br_2', createdDate: '2023-10-22', completedDate: '2023-10-24', status: 'Completed', items: [{ variantId: 'v-pos-1', quantity: 10 }] },
  { id: 'ST-002', fromBranchId: 'br_2', toBranchId: 'br_3', createdDate: '2023-10-25', status: 'In Transit', items: [{ variantId: 'v-pos-5', quantity: 20 }] },
];

// SUPER ADMIN - Platform Management
export const platformPayments: PlatformPayment[] = [
    { id: 'pay_1', tenantId: 'tnt_1', tenantName: 'Innovate Inc.', amount: 249, plan: 'Premium', gateway: 'stripe', transactionId: 'ch_123...', date: '2023-10-15', status: 'Success' },
    { id: 'pay_2', tenantId: 'tnt_2', tenantName: 'Cornerstone Cafe', amount: 99, plan: 'Pro', gateway: 'paystack', transactionId: 'ps_456...', date: '2023-10-22', status: 'Success' },
    { id: 'pay_3', tenantId: 'tnt_3', tenantName: 'Gadget Galaxy', amount: 99, plan: 'Pro', gateway: 'stripe', transactionId: 'ch_789...', date: '2023-10-10', status: 'Failed' },
];

export const announcements: Announcement[] = [
    { id: 'ann_1', title: 'New Feature: Logistics Module', content: 'We are excited to launch our new Logistics module with GPS tracking!', type: 'success', publishDate: '2023-10-20', status: 'published' },
    { id: 'ann_2', title: 'Scheduled Maintenance', content: 'We will be undergoing scheduled maintenance on Oct 30th from 2-3 AM UTC.', type: 'warning', publishDate: '2023-10-25', status: 'published' },
    { id: 'ann_3', title: 'Q4 Updates Draft', content: 'This is a draft for the upcoming Q4 feature roundup.', type: 'info', publishDate: '2023-11-01', status: 'draft' },
];

export const superAdminStaff: SuperAdminStaff[] = [
    { id: 'sa_1', name: 'Super Admin', email: 'owner@flowpay.com', roleId: 'sa_role_1', status: 'active' },
    { id: 'sa_2', name: 'Support Lead', email: 'support@flowpay.com', roleId: 'sa_role_2', status: 'active' },
];

export const superAdminRoles: SuperAdminRole[] = [
    { id: 'sa_role_1', name: 'Platform Owner', permissions: ['manage_tenants', 'manage_billing', 'manage_payments', 'system_settings', 'manage_team', 'view_reports', 'post_announcements'] },
    { id: 'sa_role_2', name: 'Support', permissions: ['manage_tenants', 'view_reports'] },
];

export const emailSmsTemplates: EmailSmsTemplate[] = [
    { id: 'tmpl_1', name: 'Welcome Email', subject: 'Welcome to FlowPay, {{tenant_name}}!', body: 'Hello {{user_name}},\n\nWelcome aboard! Your account is ready.', type: 'email' },
    { id: 'tmpl_2', name: 'Password Reset', subject: 'Reset Your FlowPay Password', body: 'Click here to reset: {{reset_link}}', type: 'email' },
    { id: 'tmpl_3', name: '2FA Code', body: 'Your FlowPay verification code is: {{2fa_code}}', type: 'sms' },
];

export const invoiceTemplates: InvoiceTemplate[] = [
    {
        id: 'inv_tmpl_1',
        name: 'Standard Service Invoice',
        defaultItems: [
            { description: 'Consulting Services', quantity: 10, unitPrice: 100 },
        ],
        notes: 'Thank you for your business. Please make payment within 30 days.'
    },
    {
        id: 'inv_tmpl_2',
        name: 'Product Sale Invoice',
        defaultItems: [
            { description: 'Product A', quantity: 2, unitPrice: 50 },
            { description: 'Product B', quantity: 5, unitPrice: 20 },
        ],
        notes: 'All sales are final. Please contact us with any questions.'
    }
];

export const cronJobs: CronJob[] = [
    { id: 'job_billing', name: 'Process Subscriptions', description: 'Handles recurring billing for all active tenants.', schedule: '0 0 * * *', lastRun: '2023-10-26 00:00:00', nextRun: '2023-10-27 00:00:00', status: 'OK' },
    { id: 'job_backups', name: 'Database Backup', description: 'Performs a full backup of the platform database.', schedule: '0 2 * * *', lastRun: '2023-10-26 02:00:00', nextRun: '2023-10-27 02:00:00', status: 'OK' },
    { id: 'job_reports', name: 'Generate Analytics', description: 'Aggregates daily analytics and reports.', schedule: '0 * * * *', lastRun: '2023-10-26 10:00:00', nextRun: '2023-10-26 11:00:00', status: 'Running' },
];

// TENANT - Automations
export const scheduledJobs: ScheduledJob[] = [
    { id: 'job_1', tenantId: 'tnt_2', name: 'Daily Sales Email', taskType: 'email_report', schedule: '0 21 * * *', lastRun: '2023-10-25 21:00:00', nextRun: '2023-10-26 21:00:00', status: 'active', config: { recipientEmail: 'manager@cornerstone.com', reportType: 'daily_sales', attachmentFormat: 'pdf' } },
    { id: 'job_2', tenantId: 'tnt_2', name: 'Weekly Inventory Summary', taskType: 'email_report', schedule: '0 2 * * 0', lastRun: '2023-10-22 02:00:00', nextRun: '2023-10-29 02:00:00', status: 'paused', config: { recipientEmail: 'admin@flowpay.com', reportType: 'inventory_summary', attachmentFormat: 'csv' } },
    { id: 'job_3', tenantId: 'tnt_1', name: 'Hourly Low Stock Check', taskType: 'low_stock_alert', schedule: '0 * * * *', lastRun: '2023-10-26 10:00:00', nextRun: '2023-10-26 11:00:00', status: 'active', config: { recipientEmail: 'ops@innovate.com' } },
    { id: 'job_4', tenantId: 'tnt_2', name: 'Monthly Credit Reminders', taskType: 'credit_reminder', schedule: '0 9 25 * *', lastRun: '2023-09-25 09:00:00', nextRun: '2023-10-25 09:00:00', status: 'active', config: {} },
    { id: 'job_inv_1001', tenantId: 'tnt_2', name: 'Monthly Invoice for Innovate Inc.', taskType: 'recurring_invoice', schedule: '0 9 15 * *', lastRun: '2023-10-15 09:00:00', nextRun: '2023-11-15 09:00:00', status: 'active', config: { sourceInvoiceId: 'inv_1001' } },
];

// SUPER ADMIN - Access Control
export const blockRules: BlockRule[] = [
    { id: 'br_1', type: 'ip', value: '123.45.67.89', reason: 'Spam activity detected', createdAt: '2023-10-20T10:00:00Z' },
    { id: 'br_2', type: 'country', value: 'North Korea', reason: 'Sanctions', createdAt: '2023-01-01T10:00:00Z' },
];

// TENANT - Device Access Control
export const approvedDevices: Device[] = [
    { id: 'dev_1', staffName: 'Admin User', name: 'Admin-Desktop', os: 'macOS', browser: 'Chrome', ipAddress: '73.22.101.50', lastLogin: '2023-10-26 10:00 AM' },
    { id: 'dev_2', staffName: 'Bob Williams', name: 'Bobs-iPhone', os: 'iOS 17', browser: 'Safari', ipAddress: '192.168.1.10', lastLogin: '2023-10-26 09:30 AM' },
];

export const pendingDevices: Device[] = [
    { id: 'dev_3', staffName: 'Charlie Brown', name: 'Galaxy S23', os: 'Android 14', browser: 'Chrome', ipAddress: '98.12.34.56', lastLogin: '2023-10-26 11:00 AM' },
];