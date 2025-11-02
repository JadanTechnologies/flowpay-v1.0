import React from 'react';
import { Sale } from '../../types';
import { useAppContext } from '../../contexts/AppContext';
import { formatCurrency } from '../../utils/formatting';

interface DetailedCashierCreditSalesTableProps {
  sales: Sale[];
}

const DetailedCashierCreditSalesTable: React.FC<DetailedCashierCreditSalesTableProps> = ({ sales }) => {
  const { customers, currency } = useAppContext();

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left text-text-secondary">
        <thead className="text-xs text-text-secondary uppercase bg-background">
          <tr>
            <th scope="col" className="px-4 py-3">Customer</th>
            <th scope="col" className="px-4 py-3">Items Sold</th>
            <th scope="col" className="px-4 py-3 text-center">Total Qty</th>
            <th scope="col" className="px-4 py-3 text-right">Amount Charged</th>
            <th scope="col" className="px-4 py-3 text-right">Balance Before</th>
            <th scope="col" className="px-4 py-3 text-right">Balance After</th>
          </tr>
        </thead>
        <tbody>
          {sales.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(sale => {
            const customer = customers.find(c => c.id === sale.customerId);
            const balanceAfter = customer?.creditBalance ?? 0;
            // The sale amount on credit sales is the amount charged
            const amountCharged = sale.amount;
            const balanceBefore = balanceAfter - amountCharged;

            const itemsSold = sale.items.map(i => i.name).join(', ');
            const totalQty = sale.items.reduce((sum, i) => sum + i.quantity, 0);

            return (
              <tr key={sale.id} className="border-b border-border hover:bg-background">
                <td className="px-4 py-3">
                  <div className="font-medium text-text-primary">{sale.customerName}</div>
                  <div className="text-xs">{customer?.phone || 'No phone'}</div>
                </td>
                <td className="px-4 py-3 text-xs">{itemsSold}</td>
                <td className="px-4 py-3 text-center font-bold">{totalQty}</td>
                <td className="px-4 py-3 text-right font-medium text-yellow-400">{formatCurrency(amountCharged, currency)}</td>
                <td className="px-4 py-3 text-right">{formatCurrency(balanceBefore, currency)}</td>
                <td className="px-4 py-3 text-right font-medium text-text-primary">{formatCurrency(balanceAfter, currency)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default DetailedCashierCreditSalesTable;
