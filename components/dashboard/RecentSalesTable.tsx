
import React from 'react';
import { Sale } from '../../types';
import { useAppContext } from '../../contexts/AppContext';
import { formatCurrency } from '../../utils/formatting';

interface RecentSalesTableProps {
  sales: Sale[];
}

const getStatusBadge = (status: Sale['status']) => {
  switch (status) {
    case 'Paid':
      return <span className="px-2 py-1 text-xs font-medium text-green-300 bg-green-900 rounded-full">{status}</span>;
    case 'Pending':
      return <span className="px-2 py-1 text-xs font-medium text-yellow-300 bg-yellow-900 rounded-full">{status}</span>;
    case 'Refunded':
      return <span className="px-2 py-1 text-xs font-medium text-gray-300 bg-gray-700 rounded-full">{status}</span>;
    default:
      return null;
  }
};

const RecentSalesTable: React.FC<RecentSalesTableProps> = ({ sales }) => {
  const { currency } = useAppContext();
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left text-text-secondary">
        <thead className="text-xs text-text-secondary uppercase bg-background">
          <tr>
            <th scope="col" className="px-4 py-3">Customer</th>
            <th scope="col" className="px-4 py-3">Branch</th>
            <th scope="col" className="px-4 py-3">Status</th>
            <th scope="col" className="px-4 py-3 text-right">Amount</th>
          </tr>
        </thead>
        <tbody>
          {sales.map((sale) => (
            <tr key={sale.id} className="border-b border-border hover:bg-background">
              <td className="px-4 py-3">
                <div className="font-medium text-text-primary">{sale.customerName}</div>
                <div className="text-xs">{sale.date}</div>
              </td>
              <td className="px-4 py-3">{sale.branch}</td>
              <td className="px-4 py-3">{getStatusBadge(sale.status)}</td>
              <td className="px-4 py-3 font-medium text-text-primary text-right">{formatCurrency(sale.amount, currency)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RecentSalesTable;
