import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { BranchPerformance } from '../../types';
import { formatCurrency } from '../../utils/formatting';
import { useAppContext } from '../../contexts/AppContext';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

interface BranchPerformanceChartProps {
  data: BranchPerformance[];
}

const BranchPerformanceChart: React.FC<BranchPerformanceChartProps> = ({ data }) => {
    const { currency } = useAppContext();

    return (
        <div className="bg-surface border border-border rounded-xl p-6 shadow-lg h-full">
            <h2 className="text-xl font-semibold text-text-primary mb-4">Branch Performance</h2>
            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => formatCurrency(value, currency)} />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};

export default BranchPerformanceChart;
