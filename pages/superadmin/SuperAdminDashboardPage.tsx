import React from 'react';
import { Users, CreditCard, Activity, BarChart2, DollarSign, TrendingDown, ChevronsRightLeft } from 'lucide-react';
import { LineChart, Line, Area, AreaChart, ComposedChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import DashboardCard from '../../components/dashboard/DashboardCard';
import { platformFinancials, financialChartData } from '../../data/mockData';
import { formatCurrency } from '../../utils/formatting';

const SuperAdminDashboardPage: React.FC = () => {
    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-text-primary">Platform Finance Dashboard</h1>
            
            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                <DashboardCard 
                    title="Monthly Recurring Revenue" 
                    value={formatCurrency(platformFinancials.mrr, 'USD')} 
                    change="+5.2% from last month" 
                    icon={<DollarSign className="text-green-500" />} 
                />
                <DashboardCard 
                    title="Operational Costs" 
                    value={formatCurrency(platformFinancials.operationalCosts, 'USD')} 
                    change="Server, API, Salaries" 
                    icon={<ChevronsRightLeft className="text-yellow-500" />} 
                />
                 <DashboardCard 
                    title="Net Profit" 
                    value={formatCurrency(platformFinancials.netProfit, 'USD')} 
                    change="71.6% profit margin" 
                    icon={<BarChart2 className="text-primary" />} 
                />
                <DashboardCard 
                    title="Active Tenants" 
                    value="1,180" 
                    change="+50 this month" 
                    icon={<Users className="text-blue-500" />} 
                />
                <DashboardCard 
                    title="Churn Rate" 
                    value={`${platformFinancials.churnRate}%`} 
                    change="-0.2% from last month" 
                    icon={<TrendingDown className="text-red-500" />} 
                />
            </div>

            <div className="grid grid-cols-1">
                <div className="bg-surface border border-border rounded-xl p-6 shadow-lg">
                    <h2 className="text-xl font-semibold text-text-primary mb-4">Financial Performance (6 Months)</h2>
                    <ResponsiveContainer width="100%" height={350}>
                        <ComposedChart data={financialChartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                            <XAxis dataKey="name" stroke="#9CA3AF" />
                            <YAxis stroke="#9CA3AF" tickFormatter={(value) => `$${Number(value) / 1000}k`} />
                            <Tooltip 
                                contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }} 
                                labelStyle={{ color: '#F9FAFB' }}
                                formatter={(value: number) => formatCurrency(value, 'USD')}
                            />
                            <Legend />
                            <Bar dataKey="costs" barSize={20} fill="#FF8042" name="Costs" />
                            <Area type="monotone" dataKey="revenue" fill="#00C49F" stroke="#00C49F" name="Revenue" />
                            <Line type="monotone" dataKey="profit" stroke="#007A7A" strokeWidth={3} name="Net Profit" />
                        </ComposedChart>
                    </ResponsiveContainer>
                </div>
            </div>

        </div>
    );
};

export default SuperAdminDashboardPage;