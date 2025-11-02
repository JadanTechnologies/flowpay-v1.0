
import React, { useState, useEffect } from 'react';
import DashboardCard from '../components/dashboard/DashboardCard';
import SalesChart from '../components/dashboard/SalesChart';
import TopProductsChart from '../components/dashboard/TopProductsChart';
import RecentSalesTable from '../components/dashboard/RecentSalesTable';
import { DollarSign, ShoppingCart, Users, Activity } from 'lucide-react';
import { salesData, topProducts, recentSales, branchPerformance } from '../data/mockData';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { useAppContext } from '../contexts/AppContext';
import { formatCurrency } from '../utils/formatting';
import { useTranslation } from '../hooks/useTranslation';
import Skeleton from '../components/ui/Skeleton';
import { ProductVariant } from '../types';

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
    const { currency } = useAppContext();
    const { t } = useTranslation();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1200); // Simulate data fetching
        return () => clearTimeout(timer);
    }, []);

    const totalRevenue = recentSales.reduce((acc, sale) => acc + sale.amount, 0);

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

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                    <div className="lg:col-span-3 bg-surface border border-border rounded-xl p-6 shadow-lg">
                        <Skeleton className="h-6 w-1/3 mb-2" />
                        <Skeleton className="h-4 w-1/2 mb-4" />
                        <div className="space-y-2">
                           <Skeleton className="h-12 w-full" />
                           <Skeleton className="h-12 w-full" />
                           <Skeleton className="h-12 w-full" />
                           <Skeleton className="h-12 w-full" />
                        </div>
                    </div>
                    <div className="lg:col-span-2 bg-surface border border-border rounded-xl p-6 shadow-lg">
                        <Skeleton className="h-6 w-1/2 mb-4" />
                         <Skeleton className="h-[350px] w-full" />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
        </div>
    );
};

export default DashboardPage;