import React from 'react';
import { PaymentHistory } from '../../types';
import { Download } from 'lucide-react';
import { useAppContext } from '../../contexts/AppContext';
import { formatCurrency } from '../../utils/formatting';

interface PaymentHistoryTableProps {
  history: PaymentHistory[];
}

const getStatusBadge = (status: PaymentHistory['status']) => {
  switch (status) {
    case 'Paid':
      return <span className="px-2 py-1 text-xs font-medium text-green-300 bg-green-900 rounded-full">{status}</span>;
    case 'Pending':
      return <span className="px-2 py-1 text-xs font-medium text-yellow-300 bg-yellow-900 rounded-full">{status}</span>;
    case 'Failed':
      return <span className="px-2 py-1 text-xs font-medium text-red-300 bg-red-900 rounded-full">{status}</span>;
    default:
      return null;
  }
};

const PaymentHistoryTable: React.FC<PaymentHistoryTableProps> = ({ history }) => {
  const { currency } = useAppContext();

  return (
    <div className="bg-background p-6 rounded-lg border border-border">
      <h3 className="text-lg font-semibold text-text-primary mb-4">Payment History</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-text-secondary">
          <thead className="text-xs text-text-secondary uppercase bg-surface">
            <tr>
              <th scope="col" className="px-4 py-3">Date</th>
              <th scope="col" className="px-4 py-3">Description</th>
              <th scope="col" className="px-4 py-3">Status</th>
              <th scope="col" className="px-4 py-3 text-right">Amount</th>
              <th scope="col" className="px-4 py-3 text-center">Invoice</th>
            </tr>
          </thead>
          <tbody>
            {history.map((item) => (
              <tr key={item.id} className="border-b border-border hover:bg-background/50">
                <td className="px-4 py-3 font-medium text-text-primary">{item.date}</td>
                <td className="px-4 py-3">{item.description}</td>
                <td className="px-4 py-3">{getStatusBadge(item.status)}</td>
                <td className="px-4 py-3 font-medium text-text-primary text-right">{formatCurrency(item.amount, currency)}</td>
                <td className="px-4 py-3 text-center">
                  <button className="text-primary hover:underline inline-flex items-center gap-1">
                    <Download size={14} /> PDF
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PaymentHistoryTable;
