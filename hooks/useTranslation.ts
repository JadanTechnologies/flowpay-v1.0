
import { useAppContext } from '../contexts/AppContext';

const translations = {
  en: {
    dashboard: 'Dashboard',
    pos: 'POS',
    inventory: 'Inventory',
    accounting: 'Accounting',
    logistics: 'Logistics',
    branches: 'Branches',
    staff: 'Staff',
    invoicing: 'Invoicing',
    creditManagement: 'Credit Management',
    activityLog: 'Activity Log',
    settings: 'Settings',
    salesOverview: 'Sales Overview',
    branchPerformance: 'Branch Performance',
    recentSales: 'Recent Sales',
    topSellingProducts: 'Top Selling Products',
    integrations: 'Integrations',
    products: 'Products',
    purchaseOrders: 'Purchase Orders',
    stockCounts: 'Stock Counts',
    suppliers: 'Suppliers',
    stockTransfers: 'Stock Transfers',
    history: 'History',
    automations: 'Automations',
    consignments: 'Consignments',
    fleetManagement: 'Fleet Management',
  },
  es: {
    dashboard: 'Tablero',
    pos: 'TPV',
    inventory: 'Inventario',
    accounting: 'Contabilidad',
    logistics: 'Logística',
    branches: 'Sucursales',
    staff: 'Personal',
    invoicing: 'Facturación',
    creditManagement: 'Gestión de Crédito',
    activityLog: 'Registro de Actividad',
    settings: 'Ajustes',
    salesOverview: 'Resumen de Ventas',
    branchPerformance: 'Rendimiento de Sucursales',
    recentSales: 'Ventas Recientes',
    topSellingProducts: 'Productos Más Vendidos',
    integrations: 'Integraciones',
    products: 'Productos',
    purchaseOrders: 'Órdenes de Compra',
    stockCounts: 'Conteos de Stock',
    suppliers: 'Proveedores',
    stockTransfers: 'Transferencias de Stock',
    history: 'Historia',
    automations: 'Automatizaciones',
    consignments: 'Envíos',
    fleetManagement: 'Gestión de Flota',
  },
  fr: {
    dashboard: 'Tableau de bord',
    pos: 'PDV',
    inventory: 'Inventaire',
    accounting: 'Comptabilité',
    logistics: 'Logistique',
    branches: 'Succursales',
    staff: 'Personnel',
    invoicing: 'Facturation',
    creditManagement: 'Gestion de Crédit',
    activityLog: 'Journal d\'activité',
    settings: 'Paramètres',
    salesOverview: 'Aperçu des Ventes',
    performanceDesSuccursales: 'Performance des Succursales',
    recentSales: 'Ventes Récentes',
    topSellingProducts: 'Meilleurs Produits de Vente',
    integrations: 'Intégrations',
    products: 'Produits',
    purchaseOrders: 'Bons de Commande',
    stockCounts: 'Comptages de Stock',
    suppliers: 'Fournisseurs',
    stockTransfers: 'Transferts de Stock',
    history: 'Histoire',
    automations: 'Automatisations',
    consignments: 'Expéditions',
    fleetManagement: 'Gestion de la Flotte',
  }
};

type TranslationKey = keyof typeof translations['en'];

export const useTranslation = () => {
  const { language } = useAppContext();
  
  const t = (key: TranslationKey): string => {
    return translations[language][key] || key;
  };

  return { t, language };
};
