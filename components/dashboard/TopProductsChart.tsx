import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Product, ProductVariant } from '../../types';

interface TopProductsChartProps {
  data: (ProductVariant & { productName: string, sales: number })[];
}

const TopProductsChart: React.FC<TopProductsChartProps> = ({ data }) => {
  return (
    <div style={{ width: '100%', height: 350 }}>
      <ResponsiveContainer>
        <BarChart layout="vertical" data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <XAxis type="number" hide />
          <YAxis 
            dataKey="productName" 
            type="category" 
            stroke="#9CA3AF" 
            width={120} 
            tick={{ fill: '#9CA3AF', fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(value, index) => {
              const item = data[index];
              const options = Object.values(item.options).join(', ');
              return options ? `${value} (${options})` : value;
            }}
          />
          <Tooltip 
            cursor={{fill: '#374151'}}
            contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '0.5rem' }} 
            labelStyle={{ color: '#F9FAFB' }}
          />
          <Bar dataKey="sales" fill="#007A7A" barSize={10} radius={[0, 10, 10, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TopProductsChart;