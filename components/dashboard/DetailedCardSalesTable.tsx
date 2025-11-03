import React from 'react';
import { Sale } from '../../types';
import { useAppContext } from '../../contexts/AppContext';
import { formatCurrency } from '../../utils/formatting';

interface DetailedCardSalesTableProps {
  sales: Sale[];
}

const DetailedCardSalesTable: React.FC<DetailedCardSalesTableProps> = ({ sales }) => {
  const { products, currency, currentBranchId } = useAppContext();

  const saleItems = sales.flatMap(sale =>
    sale.items.map(item => ({
      ...item,
      saleDate: sale.date,
      customerName: sale.customerName,
      paymentMethods: sale.payments.map(p => p.method).join(', '),
    }))
  ).sort((a, b) => new Date(b.saleDate).getTime() - new Date(a.saleDate).getTime());

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left text-text-secondary">
        <thead className="text-xs text-text-secondary uppercase bg-background">
          <tr>
            <th scope="col" className="px-4 py-3">Item Name</th>
            <th scope="col" className="px-4 py-3">Customer</th>
            <th scope="col" className="px-4 py-3">Payment Method</th>
            <th scope="col" className="px-4 py-3 text-center">Qty Before</th>
            <th scope="col" className="px-4 py-3 text-center">Qty Sold</th>
            <th scope="col" className="px-4 py-3 text-center">Qty After</th>
            <th scope="col" className="px-4 py-3 text-right">Price</th>
            <th scope="col" className="px-4 py-3 text-right">Total</th>
          </tr>
        </thead>
        <tbody>
          {saleItems.map((item, index) => {
            const product = products.find(p => p.id === item.productId);
            const variant = product?.variants.find(v => v.id === item.id);
            const currentStock = variant?.stockByBranch[currentBranchId] ?? 0;
            const qtySold = item.quantity;
            const qtyAfter = currentStock;
            const qtyBefore = qtyAfter + qtySold;
            const total = item.price * qtySold - (item.discount || 0);

            return (
              <tr key={`${item.id}-${index}`} className="border-b border-border hover:bg-background">
                <td className="px-4 py-3">
                    <div className="font-medium text-text-primary">{item.name}</div>
                    <div className="text-xs">{new Date(item.saleDate).toLocaleTimeString()}</div>
                </td>
                <td className="px-4 py-3">{item.customerName}</td>
                <td className="px-4 py-3">{item.paymentMethods}</td>
                <td className="px-4 py-3 text-center">{qtyBefore}</td>
                <td className="px-4 py-3 text-center font-bold text-yellow-400">{qtySold}</td>
                <td className="px-4 py-3 text-center">{qtyAfter}</td>
                <td className="px-4 py-3 text-right">{formatCurrency(item.price, currency)}</td>
                <td className="px-4 py-3 text-right font-medium text-text-primary">{formatCurrency(total, currency)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default DetailedCardSalesTable;