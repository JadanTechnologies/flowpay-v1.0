import React, { useState, useEffect, useMemo } from 'react';
import DashboardCard from '../components/dashboard/DashboardCard';
import SalesChart from '../components/dashboard/SalesChart';
import TopProductsChart from '../components/dashboard/TopProductsChart';
import RecentSalesTable from '../components/dashboard/RecentSalesTable';
import { DollarSign, ShoppingCart, Users, Activity, Handshake, CreditCard, ShieldCheck, X, PlusCircle, Settings, Save } from 'lucide-react';
import { salesData, topProducts, branchPerformance } from '../data/mockData';
import { useAppContext } from '../contexts/AppContext';
import { formatCurrency } from '../utils/formatting';
import { useTranslation } from '../hooks/useTranslation';
import Skeleton from '../components/ui/Skeleton';
import { Sale, InventoryAdjustmentLog, WidgetId } from '../types';
import CashierSalesDetailModal from '../components/dashboard/CashierSalesDetailModal';
import ReturnApprovalModal from '../components/dashboard/ReturnApprovalModal';
import BranchPerformanceChart from '../components/dashboard/BranchPerformanceChart';
import AddWidgetModal from '../components/dashboard/AddWidgetModal';


type WidgetConfig = {
    name: string;
    component: React.ComponentType<any>;
    props: (data: any) => any;
    layout: { colSpan: number, minH?: string };
    requiredRole?: 'Admin' | 'Manager';
}

const DashboardPage: React.FC = () => {
    const { 
        session, currency, recentSales, setRecentSales, products, setProducts, 
        currentBranchId, pendingReturns, setPendingReturns, addNotification, 
        setInventoryAdjustmentLogs, tenantSettings, setTenantSettings
    } = useAppContext();
    const { t } = useTranslation();
    const [loading, setLoading] = useState(true);
    const [modalData, setModalData] = useState<{ title: string; sales: Sale[], type: 'general' | 'credit' | 'card_transfer' } | null>(null);
    const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [isAddWidgetModalOpen, setIsAddWidgetModalOpen] = useState(false);
    const [returnNotifSent, setReturnNotifSent] = useState(false);

    const returnsForApproval = useMemo(() => 
        pendingReturns.filter(req => req.branchId === currentBranchId && req.status === 'pending'),
    [pendingReturns, currentBranchId]);

    const handleApproveReturn = (requestId: string) => {
        const request = pendingReturns.find(r => r.id === requestId);
        if (!request) {
            addNotification({ message: 'Return request not found.', type: 'error' });
            return;
        }

        const { itemsToReturn, originalSale, branchId, totalRefundAmount, cashierName } = request;

        // 1. Update stock
        setProducts(currentProducts => {
            return currentProducts.map(p => {
                const newVariants = p.variants.map(v => {
                    const returnedItem = itemsToReturn.find(item => item.id === v.id);
                    if (returnedItem) {
                        const newStockByBranch = { ...v.stockByBranch };
                        newStockByBranch[branchId] = (newStockByBranch[branchId] || 0) + returnedItem.quantity;
                        return { ...v, stockByBranch: newStockByBranch };
                    }
                    return v;
                });
                return { ...p, variants: newVariants };
            });
        });

        // 2. Create log
        const newLog: InventoryAdjustmentLog = {
            id: `adj_${Date.now()}`,
            timestamp: new Date().toISOString(),
            user: session?.user?.name || 'Manager',
            branchId: branchId,
            type: 'Sale Return',
            referenceId: originalSale.id,
            items: itemsToReturn.map(item => ({
                productId: item.productId,
                productName: item.name,
                change: item.quantity
            }))
        };
        setInventoryAdjustmentLogs(prev => [newLog, ...prev]);

        // 3. Create refund sale record
        const refundSale: Sale = {
            id: `refund_${Date.now()}`,
            customerName: originalSale.customerName,
            customerId: originalSale.customerId,
            cashierName: cashierName,
            date: new Date().toISOString(),
            amount: -totalRefundAmount,
            status: 'Refunded',
            branch: originalSale.branch,
            items: itemsToReturn.map(item => ({...item, price: -item.price})),
            payments: [{ method: 'Cash', amount: -totalRefundAmount }],
        };
        setRecentSales(prev => [refundSale, ...prev]);
        
        // 4. Remove from pending
        setPendingReturns(prev => prev.filter(r => r.id !== requestId));
        
        // 5. Notify
        addNotification({ message: `Return for sale ${originalSale.id} approved.`, type: 'success' });
        if (returnsForApproval.length - 1 === 0) {
            setIsApprovalModalOpen(false);
        }
    };
    
    const handleRejectReturn = (requestId: string) => {
        const request = pendingReturns.find(r => r.id === requestId);
        setPendingReturns(prev => prev.filter(r => r.id !== requestId));
        addNotification({ message: `Return request from ${request?.cashierName} was rejected.`, type: 'warning' });
        if (returnsForApproval.length - 1 === 0) {
            setIsApprovalModalOpen(false);
        }
    };


    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1200); // Simulate data fetching
        return () => clearTimeout(timer);
    }, []);

    // Notify manager/admin of pending returns on load
    useEffect(() => {
        if (!loading && !returnNotifSent && (session?.user?.role === 'Manager' || session?.user?.role === 'Admin')) {
            if (returnsForApproval.length > 0) {
                addNotification({
                    message: `You have ${returnsForApproval.length} return request(s) waiting for approval. Click the 'Pending Returns' widget to review.`,
                    type: 'warning',
                    duration: 10000,
                });
                setReturnNotifSent(true);
            }
        }
    }, [returnsForApproval.length, session?.user?.role, addNotification, loading, returnNotifSent]);

    const isToday = (someDate: string) => {
        const today = new Date();
        const date = new Date(someDate);
        return date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear();
    };

    const handleRemoveWidget = (widgetId: WidgetId) => {
        if (tenantSettings) {
            const newLayout = tenantSettings.dashboardLayout.filter(id => id !== widgetId);
            setTenantSettings({ ...tenantSettings, dashboardLayout: newLayout });
        }
    };

    const handleAddWidget = (widgetId: WidgetId) => {
        if (tenantSettings && !tenantSettings.dashboardLayout.includes(widgetId)) {
            const newLayout = [...tenantSettings.dashboardLayout, widgetId];
            setTenantSettings({ ...tenantSettings, dashboardLayout: newLayout });
        }
        setIsAddWidgetModalOpen(false);
    };

    const calculatedData = useMemo(() => {
        const totalRevenue = recentSales.reduce((acc, sale) => acc + sale.amount, 0);
        return { totalRevenue, currency, returnsForApproval };
    }, [recentSales, currency, returnsForApproval]);

    const widgetLibrary: Record<WidgetId, WidgetConfig> = {
        totalRevenue: { name: 'Total Revenue', component: DashboardCard, props: data => ({ title: "Total Revenue", value: formatCurrency(data.totalRevenue, data.currency), change: "+20.1% from last month", icon: <DollarSign className="text-primary" /> }), layout: { colSpan: 1 } },
        sales: { name: 'Sales', component: DashboardCard, props: () => ({ title: "Sales", value: "+12,234", change: "+19% from last month", icon: <ShoppingCart className="text-green-500" /> }), layout: { colSpan: 1 } },
        newCustomers: { name: 'New Customers', component: DashboardCard, props: () => ({ title: "New Customers", value: "+2350", change: "+180.1% from last month", icon: <Users className="text-yellow-500" /> }), layout: { colSpan: 1 } },
        activeBranches: { name: 'Active Branches', component: DashboardCard, props: () => ({ title: "Active Branches", value: "4", change: "2 online", icon: <Activity className="text-red-500" /> }), layout: { colSpan: 1 } },
        salesOverview: { name: 'Sales Overview', component: SalesChart, props: () => ({ data: salesData, currency }), layout: { colSpan: 3, minH: '450px' } },
        branchPerformance: { name: 'Branch Performance', component: BranchPerformanceChart, props: () => ({ data: branchPerformance }), layout: { colSpan: 2, minH: '450px' } },
        recentSales: { name: 'Recent Sales', component: RecentSalesTable, props: () => ({ sales: recentSales }), layout: { colSpan: 3, minH: '400px' } },
        topProducts: { name: 'Top Selling Products', component: TopProductsChart, props: () => ({ data: topProducts }), layout: { colSpan: 2, minH: '400px' } },
    };

    const allAvailableWidgets = Object.keys(widgetLibrary).map(key => ({ id: key as WidgetId, name: widgetLibrary[key as WidgetId].name }));

    if (loading) {
        return (
            <div className="space-y-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                    {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-32" />)}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                    <Skeleton className="lg:col-span-3 h-96" />
                    <Skeleton className="lg:col-span-2 h-96" />
                </div>
            </div>
        );
    }
    
    // CASHIER DASHBOARD
    if (session?.user?.role === 'Cashier') {
        const cashierName = session.user.name;
        const salesToday = recentSales.filter(s => s.cashierName === cashierName && isToday(s.date) && s.status !== 'Refunded');
        const totalSales = salesToday.reduce((sum, s) => sum + s.amount, 0);
        const creditSalesList = salesToday.filter(s => s.status === 'Credit');
        const creditSales = creditSalesList.reduce((sum, s) => sum + s.amount, 0);
        const cardTransferSalesList = salesToday.filter(s => s.payments.some(p => p.method === 'Card' || p.method === 'Bank Transfer'));
        const cardTransferSales = cardTransferSalesList.flatMap(s => s.payments).filter(p => p.method === 'Card' || p.method === 'Bank Transfer').reduce((sum, p) => sum + p.amount, 0);
        const keyStockProducts = products.filter(p => p.isFavorite).slice(0, 8);

        return (
            <>
                <div className="space-y-8">
                    <h1 className="text-3xl font-bold text-text-primary">Daily Summary</h1>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        <DashboardCard title="Your Total Sales Today" value={formatCurrency(totalSales, currency)} change={`${salesToday.length} transactions`} icon={<DollarSign className="text-green-500"/>} onClick={() => setModalData({ title: 'Total Sales Today', sales: salesToday, type: 'general' })} />
                        <DashboardCard title="Credit Sales" value={formatCurrency(creditSales, currency)} change={`${creditSalesList.length} transactions`} icon={<Handshake className="text-blue-500"/>} onClick={() => setModalData({ title: 'Credit Sales Today', sales: creditSalesList, type: 'credit' })} />
                        <DashboardCard title="Card/Bank Transfer Sales" value={formatCurrency(cardTransferSales, currency)} change={`${cardTransferSalesList.length} transactions`} icon={<CreditCard className="text-yellow-500"/>} onClick={() => setModalData({ title: 'Card/Bank Transfer Sales Today', sales: cardTransferSalesList, type: 'card_transfer' })} />
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 bg-surface border border-border rounded-xl p-6 shadow-lg"><h2 className="text-xl font-semibold text-text-primary mb-4">Your Transactions Today</h2>{salesToday.length > 0 ? <RecentSalesTable sales={salesToday.slice(0, 5)} /> : <p className="text-text-secondary text-center py-12">You haven't made any sales today.</p>}</div>
                        <div className="bg-surface border border-border rounded-xl p-6 shadow-lg"><h2 className="text-xl font-semibold text-text-primary mb-4">Key Stock Levels</h2><ul className="space-y-3 max-h-96 overflow-y-auto">{keyStockProducts.map(p => {const stock = p.variants.reduce((sum, v) => sum + (v.stockByBranch[currentBranchId] || 0), 0); const lowStockThreshold = p.variants[0]?.lowStockThreshold || 5; const isLow = stock > 0 && stock <= lowStockThreshold; const isOut = stock <= 0; return (<li key={p.id} className="flex justify-between items-center bg-background p-3 rounded-md"><span className="font-medium text-sm">{p.name}</span><span className={`font-bold text-lg ${isOut ? 'text-red-500' : isLow ? 'text-yellow-400' : 'text-text-primary'}`}>{stock}</span></li>);})}</ul></div>
                    </div>
                </div>
                {modalData && <CashierSalesDetailModal title={modalData.title} sales={modalData.sales} type={modalData.type} onClose={() => setModalData(null)} />}
            </>
        );
    }

    // ADMIN/MANAGER DASHBOARD
    const isManagerOrAdmin = session?.user?.role === 'Manager' || session?.user?.role === 'Admin';
    const layout = tenantSettings?.dashboardLayout || [];

    return (
        <div className="space-y-8">
             <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-text-primary">Dashboard</h1>
                <div className="flex items-center gap-2">
                    {isEditMode && (
                        <>
                         <button onClick={() => setIsAddWidgetModalOpen(true)} className="flex items-center gap-2 bg-primary/20 text-primary font-semibold py-2 px-4 rounded-lg transition-colors hover:bg-primary/30">
                            <PlusCircle size={16} /> Add Widget
                         </button>
                         <button onClick={() => setIsEditMode(false)} className="flex items-center gap-2 bg-green-600/20 text-green-400 font-semibold py-2 px-4 rounded-lg transition-colors hover:bg-green-600/30">
                            <Save size={16} /> Save Layout
                        </button>
                        </>
                    )}
                    {!isEditMode && (
                        <button onClick={() => setIsEditMode(true)} className="flex items-center gap-2 bg-surface hover:bg-border text-text-secondary font-semibold py-2 px-4 rounded-lg transition-colors border border-border">
                            <Settings size={16} /> Customize
                        </button>
                    )}
                </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                {layout.map(widgetId => {
                    const config = widgetLibrary[widgetId];
                    if (!config) return null;

                    if (config.requiredRole && !isManagerOrAdmin) return null;

                    const Component = config.component;
                    // Pass all calculated data to props function
                    const componentProps = config.props(calculatedData); 

                    return (
                        <div key={widgetId} style={{ gridColumn: `span ${config.layout.colSpan}`, minHeight: config.layout.minH }} className={`relative group transition-all duration-300 ${isEditMode ? 'p-4 border-2 border-dashed border-border rounded-xl' : ''}`}>
                             {isEditMode && (
                                <>
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-surface px-2 text-xs text-text-secondary rounded-full border border-border">{config.name}</div>
                                    <button
                                        onClick={() => handleRemoveWidget(widgetId)}
                                        className="absolute -top-2 -right-2 z-10 bg-red-500 text-white rounded-full p-1 shadow-lg hover:bg-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
                                        title={`Remove ${config.name}`}
                                    >
                                        <X size={16} />
                                    </button>
                                </>
                            )}
                            <div className={`h-full ${isEditMode ? 'opacity-70 grayscale' : ''}`}>
                                <Component {...componentProps} />
                            </div>
                        </div>
                    );
                })}
                 {layout.length === 0 && !isEditMode && (
                    <div className="lg:col-span-5 text-center py-20 bg-surface rounded-xl border border-border">
                        <h2 className="text-xl font-semibold">Your dashboard is empty!</h2>
                        <p className="text-text-secondary mt-2">Click 'Customize' to add some widgets.</p>
                    </div>
                )}
            </div>
            
             {isApprovalModalOpen && (
                <ReturnApprovalModal requests={returnsForApproval} onClose={() => setIsApprovalModalOpen(false)} onApprove={handleApproveReturn} onReject={handleRejectReturn} />
             )}
             {isAddWidgetModalOpen && (
                <AddWidgetModal
                    availableWidgets={allAvailableWidgets}
                    currentWidgetIds={layout}
                    onAdd={handleAddWidget}
                    onClose={() => setIsAddWidgetModalOpen(false)}
                />
             )}
        </div>
    );
};

export default DashboardPage;