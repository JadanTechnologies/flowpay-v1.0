

import { Sale, Product as InventoryProduct, SalesDataPoint, BranchPerformance, Product, SubscriptionPlan, UserSubscription, PaymentHistory, SystemSettings, Tenant, Driver, Delivery, Branch, Staff, Invoice, Customer, CreditTransaction, TenantSettings, ActivityLog, Supplier, PurchaseOrder, StockCount, StockTransfer, PlatformPayment, Announcement, SuperAdminStaff, SuperAdminRole, EmailSmsTemplate, CronJob, ScheduledJob, InventoryAdjustmentLog, BlockRule, TenantRole, Device, ActiveSubscription, ProductVariant, CartItem, Truck, Consignment } from '../types';

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
  { id: 'sale_4', customerName: 'Emma Brown', cashierName: 'Bob Williams', date: '2023-10-25T14:00:00Z', amount: 4.50, status: 'Paid', branch: 'Downtown Central', items: [ createCartItem(posProducts.find(p => p.id === 'pos-5')!, 0, 'br_1', { quantity: 2 })], payments: [{ method: 'Transfer', amount: 4.50 }] },
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
    enabledModules: ['dashboard', 'pos', 'inventory', 'reports', 'branches', 'staff', 'invoicing', 'credit_management', 'automations', 'activityLog'],
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
    { id: 'VAN-03', licensePlate: 'SG 4321 C', model: 'Mercedes-Benz Sprinter', capacity: 3000, status: 'Idle' },
    { id: 'VAN-05', licensePlate: 'SG 8888 D', model: 'Ford Transit', capacity: 3500, status: 'Maintenance' },
];

export const consignments: Consignment[] = [
    { 
        id: 'CON-2024-001', 
        truckId: 'TRUCK-01', 
        driverId: 'drv_1', 
        originBranchId: 'br_1', 
        destinationAddress: '456 Market St, Gadget Galaxy', 
        items: [{ variantId: 'v-pos-8', quantity: 20 }, { variantId: 'v-pos-11', quantity: 50 }], 
        status: 'In Transit', 
        dispatchDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), 
        deliveryDate: null 
    },
    { 
        id: 'CON-2024-002', 
        truckId: 'TRUCK-02', 
        driverId: 'drv_3', 
        originBranchId: 'br_2', 
        destinationAddress: '123 Main St, Anytown', 
        items: [{ variantId: 'v-pos-4', quantity: 100 }], 
        status: 'Pending', 
        dispatchDate: null, 
        deliveryDate: null 
    },
];

// FIX: Changed vehicleId to assignedTruckId to match the Driver type.
export const drivers: Driver[] = [
  { id: 'drv_1', name: 'John Doe', assignedTruckId: 'TRUCK-01', status: 'On Route', licenseNumber: 'D12345', phone: '555-0101' },
  { id: 'drv_2', name: 'Jane Smith', assignedTruckId: 'VAN-03', status: 'Idle', licenseNumber: 'D67890', phone: '555-0102' },
  { id: 'drv_3', name: 'Mike Ross', assignedTruckId: 'TRUCK-02', status: 'On Break', licenseNumber: 'D11223', phone: '555-0103' },
  { id: 'drv_4', name: 'Rachel Zane', assignedTruckId: 'VAN-05', status: 'In Shop', licenseNumber: 'D44556', phone: '555-0104' },
];

export const deliveries: Delivery[] = [
  { id: 'del_1', orderId: 'ORD-1024', customerName: 'Innovate Inc.', destination: '123 Tech Ave', driverId: 'drv_1', status: 'In Transit' },
  { id: 'del_2', orderId: 'ORD-1025', customerName: 'Gadget Galaxy', destination: '456 Market St', driverId: 'drv_1', status: 'Delayed' },
  { id: 'del_3', orderId: 'ORD-1026', customerName: 'Cornerstone Cafe', destination: '789 Coffee Ln', driverId: 'drv_3', status: 'Pending' },
  { id: 'del_4', orderId: 'ORD-1021', customerName: 'The Book Nook', destination: '321 Read Blvd', driverId: 'drv_2', status: 'Delivered' },
];

export const branches: Branch[] = [
    { id: 'br_1', name: 'Downtown Central', address: '123 Main St, Anytown', phone: '555-1234', managerIds: ['stf_1', 'stf_5'], status: 'active' },
    { id: 'br_2', name: 'Uptown Square', address: '456 Oak Ave, Anytown', phone: '555-5678', managerIds: ['stf_2'], status: 'active' },
    { id: 'br_3', name: 'Westside Mall', address: '789 Pine Ln, Anytown', phone: '555-9012', managerIds: ['stf_3'], status: 'inactive' },
];

export const tenantRoles: TenantRole[] = [
    { id: 'trole_1', name: 'Admin', permissions: ['manage_pos', 'manage_inventory', 'manage_staff', 'manage_branches', 'manage_automations', 'view_accounting', 'process_returns', 'access_settings'] },
    { id: 'trole_2', name: 'Manager', permissions: ['manage_pos', 'manage_inventory', 'manage_staff', 'view_accounting', 'process_returns'] },
    { id: 'trole_3', name: 'Cashier', permissions: ['manage_pos', 'process_returns'] },
];

export const staff: Staff[] = [
  { id: 'stf_1', name: 'Bob Williams', email: 'bob@flowpay.com', username: 'bobw', roleId: 'trole_2', branch: 'Downtown Central', status: 'active' },
  { id: 'stf_2', name: 'Charlie Brown', email: 'charlie@flowpay.com', username: 'charlieb', roleId: 'trole_3', branch: 'Uptown Square', status: 'active' },
  { id: 'stf_3', name: 'Diana Prince', email: 'diana@flowpay.com', username: 'dianap', roleId: 'trole_3', branch: 'Westside Mall', status: 'on-leave' },
  { id: 'stf_4', name: 'Alice Johnson', email: 'alice@flowpay.com', username: 'alicej', roleId: 'trole_2', branch: 'Downtown Central', status: 'active' },
  { id: 'stf_5', name: 'Admin User', email: 'admin@flowpay.com', username: 'admin', roleId: 'trole_1', branch: 'Downtown Central', status: 'active' },
];

export const customers: Customer[] = [
    { id: 'cust_1', name: 'Liam Johnson', email: 'liam@example.com', phone: '555-1111', creditBalance: 0 },
    { id: 'cust_2', name: 'Olivia Smith', email: 'olivia@example.com', phone: '555-2222', creditBalance: 0 },
    { id: 'cust_3', name: 'Gadget Galaxy', email: 'support@gadgetgalaxy.com', phone: '555-3333', creditBalance: 8.50 },
    { id: 'cust_4', name: 'Walk-in Customer', creditBalance: 0 },
];

export const suppliers: Supplier[] = [
  { id: 'sup_1', name: 'Global Foods Inc.', contactPerson: 'Sarah Chen', email: 'sarah.chen@globalfoods.com', phone: '555-0101', address: '100 Market St', paymentTerms: 'Net 30' },
  { id: 'sup_2', name: 'Bakery Supplies Co.', contactPerson: 'Tom Adams', email: 'tadams@bakerysupplies.com', phone: '555-0102', address: '200 Flour Rd', paymentTerms: 'Net 15' },
  { id: 'sup_3', name: 'Fresh Beverages Ltd.', contactPerson: 'Maria Garcia', email: 'maria.g@freshbev.com', phone: '555-0103', address: '300 Aqua Blvd', paymentTerms: 'Due on Receipt' },
];

export const purchaseOrders: PurchaseOrder[] = [
  { id: 'PO-2024-001', supplierId: 'sup_1', supplierName: 'Global Foods Inc.', deliveryBranchId: 'br_1', createdDate: '2024-07-15', expectedDate: '2024-07-22', status: 'Received', items: [{ productId: 'v-pos-9', name: 'Sandwich', sku: 'FOD-SND-TRK', quantity: 50, costPrice: 2.50, quantityReceived: 50 }], totalCost: 125.00, notes: 'Urgent restock' },
  { id: 'PO-2024-002', supplierId: 'sup_2', supplierName: 'Bakery Supplies Co.', deliveryBranchId: 'br_2', createdDate: '2024-07-18', expectedDate: '2024-07-25', status: 'Partial', items: [{ productId: 'v-pos-4', name: 'Croissant', sku: 'PST-CRS-BTR', quantity: 100, costPrice: 0.90, quantityReceived: 50 }], totalCost: 90.00 },
  { id: 'PO-2024-003', supplierId: 'sup_3', supplierName: 'Fresh Beverages Ltd.', deliveryBranchId: 'br_1', createdDate: '2024-07-20', expectedDate: '2024-07-28', status: 'Pending', items: [{ productId: 'v-pos-7', name: 'Iced Tea', sku: 'DRK-TEA-ICD', quantity: 200, costPrice: 0.50, quantityReceived: 0 }], totalCost: 100.00 },
];

export const stockCounts: StockCount[] = [
    { id: 'SC-2024-001', branchId: 'br_1', date: '2024-07-01', status: 'Completed', items: [] },
    { id: 'SC-2024-002', branchId: 'br_2', date: '2024-07-15', status: 'In Progress', items: [] },
];

export const stockTransfers: StockTransfer[] = [
    { id: 'ST-2024-001', fromBranchId: 'br_2', toBranchId: 'br_1', createdDate: '2024-07-10', completedDate: '2024-07-12', status: 'Completed', items: [{ variantId: 'v-pos-2-s', quantity: 10 }] },
    { id: 'ST-2024-002', fromBranchId: 'br_1', toBranchId: 'br_2', createdDate: '2024-07-20', status: 'In Transit', items: [{ variantId: 'v-pos-1', quantity: 20 }] },
];

export const inventoryAdjustmentLogs: InventoryAdjustmentLog[] = [
    { id: 'adj_1', timestamp: '2024-07-22T10:00:00Z', user: 'Admin User', branchId: 'br_1', type: 'Purchase Order Receipt', referenceId: 'PO-2024-001', items: [{ productId: 'pos-9', productName: 'Sandwich', change: 50 }] },
    { id: 'adj_2', timestamp: '2024-07-21T14:00:00Z', user: 'Admin User', branchId: 'br_1', type: 'Manual Adjustment', items: [{ productId: 'pos-1', productName: 'Espresso', change: -2 }], referenceId: 'Damaged' },
];

export const scheduledJobs: ScheduledJob[] = [
  { id: 'job_1', tenantId: 'tnt_2', name: 'Daily Sales Report', taskType: 'email_report', schedule: '0 23 * * *', lastRun: '2024-07-21 23:00:00', nextRun: '2024-07-22 23:00:00', status: 'active', config: { recipientEmail: 'manager@cornerstone.com', reportType: 'daily_sales', attachmentFormat: 'pdf' } },
  { id: 'job_2', tenantId: 'tnt_2', name: 'Low Stock Alerts', taskType: 'low_stock_alert', schedule: '0 */4 * * *', lastRun: '2024-07-22 08:00:00', nextRun: '2024-07-22 12:00:00', status: 'active', config: { recipientEmail: 'inventory@cornerstone.com' } },
  { id: 'job_3', tenantId: 'tnt_5', name: 'Weekly Data Backup', taskType: 'data_backup', schedule: '0 2 * * 0', lastRun: '2024-07-21 02:00:00', nextRun: '2024-07-28 02:00:00', status: 'paused', config: { backupLocation: 'google_drive', backupFormat: 'json' } },
  { id: 'job_4', tenantId: 'tnt_2', name: 'Credit Reminders', taskType: 'credit_reminder', schedule: '0 9 * * 1', lastRun: '2024-07-22 09:00:00', nextRun: '2024-07-29 09:00:00', status: 'active', config: {} },
];

export const tenantSettings: TenantSettings = {
    id: 'ts_1',
    tenantId: 'tnt_2',
    trackerIntegration: {
        provider: 'teltonika',
        enableWeightSensors: true,
        apiUrl: 'https://api.teltonika.com',
        apiKey: 'xxxxxxxxxxxxxxxx'
    },
    inactivityLogoutTimer: 30,
};

export const blockRules: BlockRule[] = [
    { id: 'br_1', type: 'ip', value: '123.45.67.89', reason: 'Spam activity detected', createdAt: '2024-07-01T10:00:00Z' },
    { id: 'br_2', type: 'country', value: 'North Korea', reason: 'High-risk region', createdAt: '2024-06-15T10:00:00Z' },
];

export const approvedDevices: Device[] = [
    { id: 'dev_1', staffName: 'Admin User', name: 'MacBook Pro', os: 'macOS', browser: 'Chrome', ipAddress: '73.15.22.100', lastLogin: new Date(Date.now() - 3600000).toLocaleString() },
];

export const pendingDevices: Device[] = [
    { id: 'dev_2', staffName: 'Charlie Brown', name: 'iPhone 15', os: 'iOS', browser: 'Safari', ipAddress: '208.80.154.224', lastLogin: new Date(Date.now() - 600000).toLocaleString() },
];

export const invoices: Invoice[] = [
  { id: 'inv_1001', customerName: 'Innovate Inc.', issueDate: '2023-10-15', dueDate: '2023-11-14', amount: 2500, status: 'Paid' },
  { id: 'inv_1002', customerName: 'Gadget Galaxy', issueDate: '2023-10-20', dueDate: '2023-11-19', amount: 1200, status: 'Due' },
  { id: 'inv_1003', customerName: 'The Book Nook', issueDate: '2023-09-05', dueDate: '2023-10-05', amount: 450, status: 'Overdue' },
];

export const creditTransactions: CreditTransaction[] = [
    { id: 'ctx_1', customerId: 'cust_3', date: '2023-10-25', type: 'Sale', amount: 8.50, saleId: 'sale_6' },
    { id: 'ctx_2', customerId: 'cust_3', date: '2023-10-20', type: 'Payment', amount: -50.00 },
];

export const activityLogs: ActivityLog[] = [
  { id: 'log_1', tenantId: 'tnt_2', timestamp: new Date(Date.now() - 300000).toISOString(), user: 'Admin User', userRole: 'Admin', action: 'Login', details: 'User logged in from IP 192.168.1.1', branch: 'Downtown Central' },
  { id: 'log_2', tenantId: 'tnt_2', timestamp: new Date(Date.now() - 600000).toISOString(), user: 'Charlie Brown', userRole: 'Cashier', action: 'Sale', details: 'Completed sale #sale_2 for $22.50', branch: 'Uptown Square' },
  { id: 'log_3', tenantId: 'tnt_2', timestamp: new Date(Date.now() - 900000).toISOString(), user: 'Admin User', userRole: 'Admin', action: 'Inventory Adjustment', details: 'Manually adjusted stock for "Espresso" by -2', branch: 'Downtown Central' },
  { id: 'log_4', tenantId: 'tnt_3', timestamp: new Date(Date.now() - 1200000).toISOString(), user: 'Mike Ross', userRole: 'Manager', action: 'Created PO', details: 'Created Purchase Order #PO-2024-002', branch: 'Uptown Square' },
];

export const platformPayments: PlatformPayment[] = [
    { id: 'pay_1', tenantId: 'tnt_1', tenantName: 'Innovate Inc.', amount: 249, plan: 'Premium', gateway: 'stripe', transactionId: 'ch_xxxxxxxxxx', date: '2024-07-15', status: 'Success' },
    { id: 'pay_2', tenantId: 'tnt_2', tenantName: 'Cornerstone Cafe', amount: 99, plan: 'Pro', gateway: 'paystack', transactionId: 'Txxxxxxxxxx', date: '2024-07-22', status: 'Success' },
];

export const announcements: Announcement[] = [
    { id: 'ann_1', title: 'New Feature: Logistics Module!', content: 'We are excited to launch our new Logistics and GPS Tracking module for all Premium plan subscribers.', type: 'success', publishDate: '2024-07-10', status: 'published' },
    { id: 'ann_2', title: 'Scheduled Maintenance', content: 'We will be undergoing scheduled maintenance on July 30th from 2 AM to 3 AM UTC.', type: 'warning', publishDate: '2024-07-25', status: 'draft' },
];

export const superAdminRoles: SuperAdminRole[] = [
  { id: 'sa_role_1', name: 'Owner', permissions: ['manage_tenants', 'manage_billing', 'manage_payments', 'system_settings', 'manage_team', 'view_reports', 'post_announcements'] },
  { id: 'sa_role_2', name: 'Support', permissions: ['manage_tenants', 'view_reports'] },
];

export const superAdminStaff: SuperAdminStaff[] = [
  { id: 'sa_1', name: 'Super Admin', email: 'owner@flowpay.com', roleId: 'sa_role_1', status: 'active' },
  { id: 'sa_2', name: 'Support Staff', email: 'support@flowpay.com', roleId: 'sa_role_2', status: 'active' },
];

export const emailSmsTemplates: EmailSmsTemplate[] = [
    { id: 'tpl_1', name: 'Welcome Email', subject: 'Welcome to FlowPay, {{tenant_name}}!', body: 'Hello {{user_name}},\n\nWelcome to FlowPay!', type: 'email' },
    { id: 'tpl_2', name: 'Password Reset', subject: 'Reset Your Password', body: 'Click here to reset: {{reset_link}}', type: 'email' },
    { id: 'tpl_3', name: '2FA Code', body: 'Your FlowPay verification code is: {{2fa_code}}', type: 'sms' },
];

export const cronJobs: CronJob[] = [
    { id: 'cron_1', name: 'Subscription Billing', description: 'Processes monthly and yearly subscription renewals.', schedule: '0 1 * * *', lastRun: '2024-07-22 01:00:00', nextRun: '2024-07-23 01:00:00', status: 'OK' },
    { id: 'cron_2', name: 'Tenant Usage Analytics', description: 'Aggregates tenant activity data for reports.', schedule: '*/30 * * * *', lastRun: '2024-07-22 10:30:00', nextRun: '2024-07-22 11:00:00', status: 'Running' },
];


// Data for Super Admin System Settings
// FIX: Completed the branding object to match the BrandingSettings type and added the mobileApp object.
export const systemSettings: SystemSettings = {
  id: 1,
  isMaintenanceMode: false,
  maintenanceMessage: "We are currently undergoing scheduled maintenance. We'll be back shortly.",
  inactivityLogoutTimer: 60,
  paymentGateways: [
    { id: 'stripe', name: 'Stripe', enabled: true, apiKey: 'pk_live_xxxxxxxxxxxxxxxxxxxxxxxx', secretKey: 'sk_live_xxxxxxxxxxxxxxxxxxxxxxxx', webhookUrl: 'https://api.flowpay.com/webhooks/stripe' },
    { id: 'paypal', name: 'PayPal', enabled: false, apiKey: 'AYxxxxxxxx-xxxxxxxx', secretKey: 'ELxxxxxxxx-xxxxxxxx', webhookUrl: 'https://api.flowpay.com/webhooks/paypal' },
    { id: 'paystack', name: 'Paystack', enabled: true, apiKey: 'pk_live_xxxxxxxxxxxxxxxxxxxxxxxx', secretKey: 'sk_live_xxxxxxxxxxxxxxxxxxxxxxxx', webhookUrl: 'https://api.flowpay.com/webhooks/paystack' },
    { id: 'flutterwave', name: 'Flutterwave', enabled: true, apiKey: 'FLWPUBK_LIVE-xxxxxxxxxxxxxxxx', secretKey: 'FLWSECK_LIVE-xxxxxxxxxxxxxxxx', webhookUrl: 'https://api.flowpay.com/webhooks/flutterwave' },
    { id: 'monnify', name: 'Monnify', enabled: false, apiKey: '', secretKey: '', webhookUrl: 'https://api.flowpay.com/webhooks/monnify' },
    { id: 'wise', name: 'Wise', enabled: false, apiKey: '', secretKey: '', webhookUrl: 'https://api.flowpay.com/webhooks/wise' },
    { id: 'googlepay', name: 'Google Pay', enabled: false, apiKey: '', secretKey: '', webhookUrl: 'https://api.flowpay.com/webhooks/googlepay' },
    { id: 'payoneer', name: 'Payoneer', enabled: false, apiKey: '', secretKey: '', webhookUrl: 'https://api.flowpay.com/webhooks/payoneer' },
    { id: '2checkout', name: '2Checkout', enabled: false, apiKey: '', secretKey: '', webhookUrl: 'https://api.flowpay.com/webhooks/2checkout' },
    { id: 'manual', name: 'Manual/Bank Transfer', enabled: true, apiKey: 'Bank: FlowPay Bank\nAccount: 1234567890\nReference: Your Company Name', secretKey: '', webhookUrl: '' },
  ],
  email: {
    provider: 'smtp',
    host: 'smtp.mailtrap.io',
    port: 2525,
    user: 'smtp_user',
    pass: 'smtp_pass'
  },
  notifications: {
    twilioSid: 'ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    twilioToken: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    oneSignalAppId: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
    oneSignalApiKey: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    firebaseServerKey: 'AIzaSyxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
  },
  ipGeolocation: {
      provider: 'ip-api',
  },
  branding: {
      platformName: 'FlowPay',
      logoUrl: '',
      faviconUrl: '',
      landingNavItems: [
        { name: 'Features', href: '#features' },
        { name: 'Pricing', href: '#pricing' },
        { name: 'Testimonials', href: '#testimonials' },
        { name: 'FAQ', href: '#faq' },
      ],
      signInButtonText: 'Sign In',
      mainCtaText: 'Start Free Trial',
      mobileMenuCtaText: 'Get Started',
      mobileMenuExistingCustomerText: 'Existing customer?',
      heroTitle: 'The All-In-One <span class="text-primary">POS & Logistics</span> Platform',
      heroSubtitle: 'FlowPay combines Point of Sale, Inventory, Accounting, and GPS Tracking into one seamless, powerful SaaS solution designed for B2B success.',
      heroMainCtaText: 'Start Your 30-Day Free Trial',
      heroSecondaryCtaText: 'Explore Features',
      heroStats: [
          { value: '10,000+', label: 'Businesses Served' },
          { value: '$1B+', label: 'Processed Annually' },
          { value: '4.9/5', label: 'Customer Rating' },
      ],
      featuresSectionTitle: 'Everything Your Business Needs',
      featuresSectionSubtitle: "FlowPay is more than just a POS. It's a complete ecosystem to manage and grow your business.",
      features: [
        { icon: 'ShoppingCart', title: 'Point of Sale', description: 'Intuitive, fast, and reliable POS system for any retail environment.' },
        { icon: 'Package', title: 'Inventory Management', description: 'Track stock levels across multiple branches in real-time with purchase orders and stock counts.' },
        { icon: 'BookOpen', title: 'Integrated Accounting', description: 'Automate bookkeeping, manage invoices, and get a clear view of your finances.' },
        { icon: 'Truck', title: 'Logistics & GPS Tracking', description: 'Optimize delivery routes, track your fleet, and manage drivers effortlessly.' },
        { icon: 'Users', title: 'Staff & Branch Management', description: 'Control user roles, permissions, and manage multiple business locations seamlessly.' },
        { icon: 'BarChart', title: 'Advanced Reporting', description: 'Gain actionable insights into your sales, products, and business performance.' },
      ],
      pricingSectionTitle: 'Flexible Pricing for Teams of Any Size',
      pricingSectionSubtitle: 'Choose a plan that fits your needs. All plans start with a 30-day free trial.',
      popularPlanBadgeText: 'Most Popular',
      contactSalesButtonText: 'Contact Sales',
      testimonialsSectionTitle: 'Loved by Businesses Worldwide',
      testimonialsSectionSubtitle: "Don't just take our word for it. Here's what our customers are saying.",
      testimonials: [
        { quote: 'FlowPay revolutionized our inventory management. What used to take days now takes hours. The real-time tracking is a game-changer for our logistics.', name: 'John Doe', title: 'CEO, Innovate Inc.', avatar: 'https://picsum.photos/seed/john/100' },
        { quote: "The POS is incredibly easy to use for our staff, and the accounting integration saves us so much time on bookkeeping. Highly recommended!", name: 'Jane Smith', title: 'Owner, Cornerstone Cafe', avatar: 'https://picsum.photos/seed/jane/100' },
        { quote: "As a multi-branch business, managing everything from a central dashboard has been invaluable. The support team is also top-notch.", name: 'Mike Ross', title: 'Operations Manager, Gadget Galaxy', avatar: 'https://picsum.photos/seed/mike/100' },
      ],
      faqSectionTitle: 'Frequently Asked Questions',
      faqSectionSubtitle: "Have questions? We've got answers. If you can't find what you're looking for, feel free to contact us.",
      faqItems: [
        { question: 'Is there a free trial?', answer: 'Yes! All our plans come with a 30-day free trial, no credit card required. You can explore all the features and decide which plan is right for you.' },
        { question: 'Can I change my plan later?', answer: 'Absolutely. You can upgrade or downgrade your plan at any time from your billing settings. Changes will be prorated.' },
        { question: 'Is my data secure?', answer: 'Data security is our top priority. We use industry-standard encryption, regular backups, and robust security measures to protect your information.' },
        { question: 'Do you offer customer support?', answer: 'Yes, we offer email support on all plans. Our Pro and Premium plans include priority support and dedicated account managers.' },
      ],
      mobileAppSectionTitle: 'FlowPay on the Go',
      mobileAppSectionSubtitle: 'Manage your business from anywhere. Download our mobile app to access key features right from your pocket.',
      footerDescription: 'The ultimate SaaS platform for POS, Inventory, and Logistics management.',
      footerLinkSections: [
          { title: 'Product', links: [{ name: 'Features', href: '#features' }, { name: 'Pricing', href: '#pricing' }, { name: 'Integrations', href: '#' }] },
          { title: 'Company', links: [{ name: 'About Us', href: '#' }, { name: 'Careers', href: '#' }, { name: 'Contact Us', href: '#' }] },
      ]
  },
  mobileApp: {
    enabled: true,
    forceUpdate: false,
    minVersionAndroid: '1.2.0',
    minVersionIos: '1.2.1',
    storeUrlAndroid: 'https://play.google.com',
    storeUrlIos: 'https://www.apple.com/app-store/',
    maintenanceMode: false,
    maintenanceMessage: 'The mobile app is currently down for maintenance. Please check back later.',
    appLogoUrl: '',
    splashScreenUrl: '',
    androidFileName: '',
    androidFileSize: 0,
    androidLastUpdated: '',
    iosFileName: '',
    iosFileSize: 0,
    iosLastUpdated: '',
  },
  supabaseUrl: 'https://your-project-id.supabase.co',
  supabaseAnonKey: 'your-public-anon-key',
  supabaseBucket: 'your-storage-bucket-name',
  isSupabaseConfigured: false,
  footerCredits: `© ${new Date().getFullYear()} FlowPay Inc. All rights reserved.`,
  termsUrl: '#',
  privacyUrl: '#',
  refundUrl: '#'
};
