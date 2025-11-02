import React, { useState, useEffect, useMemo } from 'react';
import DashboardCard from '../components/dashboard/DashboardCard';
import SalesChart from '../components/dashboard/SalesChart';
import TopProductsChart from '../components/dashboard/TopProductsChart';
import RecentSalesTable from '../components/dashboard/RecentSalesTable';
import { DollarSign, ShoppingCart, Users, Activity, Handshake, CreditCard, RotateCcw, ShieldCheck } from 'lucide-react';
// FIX: Remove `recentSales` from this import as it's now coming from AppContext
import { salesData, topProducts, branchPerformance } from '../data/mockData';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { useAppContext } from '../contexts/AppContext';
import { formatCurrency } from '../utils/formatting';
import { useTranslation } from '../hooks/useTranslation';
import Skeleton from '../components/ui/Skeleton';
import { ProductVariant, Sale, InventoryAdjustmentLog } from '../types';
import CashierSalesDetailModal from '../components/dashboard/CashierSalesDetailModal';
import ReturnApprovalModal from '../components/dashboard/ReturnApprovalModal';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const DashboardCardSkeleton: React.FC = () => (
    <div className="bg-surface border border-border rounded-xl p-6 flex flex-col justify-between">
        <div className="flex justify-between items-center">
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-6 w-6 rounded-full" />
        </div>
        <div>
            <Skeleton className="h-8 w-3/4 mt-2" />
            <Skeleton className="h-3 w-2/3 mt-2" />
        </div>
    </div>
);


const DashboardPage: React.FC = () => {
    const { 
        session, currency, recentSales, setRecentSales, products, setProducts, 
        currentBranchId, pendingReturns, setPendingReturns, addNotification, 
        setInventoryAdjustmentLogs
    } = useAppContext();
    const { t } = useTranslation();
    const [loading, setLoading] = useState(true);
    const [modalData, setModalData] = useState<{ title: string; sales: Sale[], type: 'general' | 'credit' } | null>(null);
    const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false);

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

    const isToday = (someDate: string) => {
        const today = new Date();
        const date = new Date(someDate);
        return date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear();
    };


    if (loading) {
        return (
            <div className="space-y-8">
                {/* Stat Cards Skeleton */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <DashboardCardSkeleton />
                    <DashboardCardSkeleton />
                    <DashboardCardSkeleton />
                    <DashboardCardSkeleton />
                </div>
                
                {/* Main content grid Skeleton */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 bg-surface border border-border rounded-xl p-6 shadow-lg">
                        <Skeleton className="h-6 w-1/3 mb-4" />
                        <Skeleton className="h-[350px] w-full" />
                    </div>
                    <div className="bg-surface border border-border rounded-xl p-6 shadow-lg">
                        <Skeleton className="h-6 w-1/2 mb-4" />
                        <Skeleton className="h-[300px] w-full" />
                    </div>
                </div>
            </div>
        );
    }

    if (session?.user?.role === 'Cashier') {
        const cashierName = session.user.name;
        const salesToday = recentSales.filter(s => s.cashierName === cashierName && isToday(s.date) && s.status !== 'Refunded');

        const totalSales = salesToday.reduce((sum, s) => sum + s.amount, 0);

        const creditSalesList = salesToday.filter(s => s.status === 'Credit');
        const creditSales = creditSalesList.reduce((sum, s) => sum + s.amount, 0);
        
        const cardTransferSalesList = salesToday.filter(s => s.payments.some(p => p.method === 'Card' || p.method === 'Transfer'));
        const cardTransferSales = cardTransferSalesList.flatMap(s => s.payments)
            .filter(p => p.method === 'Card' || p.method === 'Transfer')
            .reduce((sum, p) => sum + p.amount, 0);
        
        const keyStockProducts = products.filter(p => p.isFavorite).slice(0, 8);

        return (
            <>
                <div className="space-y-8">
                    <h1 className="text-3xl font-bold text-text-primary">Daily Summary</h1>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        <DashboardCard 
                            title="Your Total Sales Today" 
                            value={formatCurrency(totalSales, currency)} 
                            change={`${salesToday.length} transactions`} 
                            icon={<DollarSign className="text-green-500"/>}
                            onClick={() => setModalData({ title: 'Total Sales Today', sales: salesToday, type: 'general' })}
                        />
                        <DashboardCard 
                            title="Credit Sales" 
                            value={formatCurrency(creditSales, currency)} 
                            change={`${creditSalesList.length} transactions`} 
                            icon={<Handshake className="text-blue-500"/>}
                            onClick={() => setModalData({ title: 'Credit Sales Today', sales: creditSalesList, type: 'credit' })}
                        />
                        <DashboardCard 
                            title="Card/Transfer Sales" 
                            value={formatCurrency(cardTransferSales, currency)} 
                            change={`${cardTransferSalesList.length} transactions`} 
                            icon={<CreditCard className="text-yellow-500"/>}
                            onClick={() => setModalData({ title: 'Card/Transfer Sales Today', sales: cardTransferSalesList, type: 'general' })}
                        />
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 bg-surface border border-border rounded-xl p-6 shadow-lg">
                            <h2 className="text-xl font-semibold text-text-primary mb-4">Your Transactions Today</h2>
                            {salesToday.length > 0 ? (
                                <RecentSalesTable sales={salesToday.slice(0, 5)} />
                            ) : (
                                <p className="text-text-secondary text-center py-12">You haven't made any sales today.</p>
                            )}
                        </div>
                        <div className="bg-surface border border-border rounded-xl p-6 shadow-lg">
                            <h2 className="text-xl font-semibold text-text-primary mb-4">Key Stock Levels</h2>
                            <ul className="space-y-3 max-h-96 overflow-y-auto">
                                {keyStockProducts.map(p => {
                                    const stock = p.variants.reduce((sum, v) => sum + (v.stockByBranch[currentBranchId] || 0), 0);
                                    const lowStockThreshold = p.variants[0]?.lowStockThreshold || 5;
                                    const isLow = stock > 0 && stock <= lowStockThreshold;
                                    const isOut = stock <= 0;
                                    return (
                                        <li key={p.id} className="flex justify-between items-center bg-background p-3 rounded-md">
                                            <span className="font-medium text-sm">{p.name}</span>
                                            <span className={`font-bold text-lg ${isOut ? 'text-red-500' : isLow ? 'text-yellow-400' : 'text-text-primary'}`}>{stock}</span>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    </div>
                </div>

                {modalData && (
                    <CashierSalesDetailModal 
                        title={modalData.title}
                        sales={modalData.sales}
                        type={modalData.type}
                        onClose={() => setModalData(null)}
                    />
                )}
            </>
        );
    }

    const totalRevenue = recentSales.reduce((acc, sale) => acc + sale.amount, 0);
    const isManagerOrAdmin = session?.user?.role === 'Manager' || session?.user?.role === 'Admin';


    return (
        <div className="space-y-8">
            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                <DashboardCard 
                    title="Total Revenue" 
                    value={formatCurrency(totalRevenue, currency)} 
                    change="+20.1% from last month" 
                    icon={<DollarSign className="text-primary" />} 
                />
                <DashboardCard 
                    title="Sales" 
                    value="+12,234" 
                    change="+19% from last month" 
                    icon={<ShoppingCart className="text-green-500" />} 
                />
                <DashboardCard 
                    title="New Customers" 
                    value="+2350" 
                    change="+180.1% from last month" 
                    icon={<Users className="text-yellow-500" />} 
                />
                <DashboardCard 
                    title="Active Branches" 
                    value="4" 
                    change="2 online" 
                    icon={<Activity className="text-red-500" />} 
                />
                 {isManagerOrAdmin && (
                    <DashboardCard
                        title="Pending Returns"
                        value={returnsForApproval.length.toString()}
                        change={returnsForApproval.length > 0 ? "requires approval" : "No pending requests"}
                        icon={<ShieldCheck className={returnsForApproval.length > 0 ? "text-orange-500 animate-pulse" : "text-orange-500/50"} />}
                        onClick={() => returnsForApproval.length > 0 && setIsApprovalModalOpen(true)}
                    />
                )}
            </div>
            
            {/* Main content grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-surface border border-border rounded-xl p-6 shadow-lg">
                    <h2 className="text-xl font-semibold text-text-primary mb-4">{t('salesOverview')}</h2>
                    <SalesChart data={salesData} currency={currency} />
                </div>
                <div className="bg-surface border border-border rounded-xl p-6 shadow-lg">
                    <h2 className="text-xl font-semibold text-text-primary mb-4">{t('branchPerformance')}</h2>
                     <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={branchPerformance}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={100}
                                fill="#8884d8"
                                dataKey="value"
                                nameKey="name"
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            >
                                {branchPerformance.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip formatter={(value: number) => formatCurrency(value, currency)} />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

             <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <div className="lg:col-span-3 bg-surface border border-border rounded-xl p-6 shadow-lg">
                    <h2 className="text-xl font-semibold text-text-primary mb-4">{t('recentSales')}</h2>
                    <p className="text-sm text-text-secondary mb-4">You made 265 sales this month.</p>
                    <RecentSalesTable sales={recentSales} />
                </div>
                <div className="lg:col-span-2 bg-surface border border-border rounded-xl p-6 shadow-lg">
                    <h2 className="text-xl font-semibold text-text-primary mb-4">{t('topSellingProducts')}</h2>
                    <TopProductsChart data={topProducts} />
                </div>
             </div>

             {isApprovalModalOpen && (
                <ReturnApprovalModal
                    requests={returnsForApproval}
                    onClose={() => setIsApprovalModalOpen(false)}
                    onApprove={handleApproveReturn}
                    onReject={handleRejectReturn}
                />
             )}
        </div>
    );
};

export default DashboardPage;
