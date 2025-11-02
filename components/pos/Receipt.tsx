import React from 'react';
import { Sale } from '../../types';
import { formatCurrency } from '../../utils/formatting';
import { Zap } from 'lucide-react';

interface ReceiptProps {
  sale: Sale;
  isPreview?: boolean;
}

const Receipt: React.FC<ReceiptProps> = ({ sale, isPreview = false }) => {
  const subtotal = sale.items.reduce((sum, item) => {
    const itemTotal = item.price * item.quantity;
    const itemDiscount = item.discount || 0;
    return sum + itemTotal - itemDiscount;
  }, 0);
  const tax = sale.amount - subtotal;
  
  return (
    <div className={!isPreview ? 'print-receipt bg-white text-black font-mono w-[80mm] p-[10px]' : 'bg-white text-black font-mono p-4'}>
      <div className="text-center">
        <div className="flex justify-center items-center gap-2 mb-2">
            <Zap className="text-black" size={20} />
            <h1 className="text-xl font-bold">FlowPay Inc.</h1>
        </div>
        <p className="text-xs">123 Tech Street, Silicon Valley, CA</p>
        <p className="text-xs">www.flowpay.com</p>
        <p className="text-xs">Tel: 555-123-4567</p>
      </div>

      <div className="border-t border-b border-dashed border-black my-3 py-1 text-xs">
          <p>Date: {new Date(sale.date).toLocaleString()}</p>
          <p>Receipt #: {sale.id}</p>
          <p>Cashier: {sale.cashierName}</p>
          <p>Branch: {sale.branch}</p>
          <p>Customer: {sale.customerName}</p>
      </div>

      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-dashed border-black">
            <th className="text-left font-semibold">ITEM</th>
            <th className="text-center font-semibold">QTY</th>
            <th className="text-right font-semibold">PRICE</th>
            <th className="text-right font-semibold">TOTAL</th>
          </tr>
        </thead>
        <tbody>
          {sale.items.map(item => (
            <tr key={item.id}>
              <td className="text-left py-1">
                {item.name}
                {item.discount && item.discount > 0 ? (
                    <div className="text-xs">Discount -{item.discount.toFixed(2)}</div>
                ) : null}
              </td>
              <td className="text-center">{item.quantity}</td>
              <td className="text-right">{item.price.toFixed(2)}</td>
              <td className="text-right">{((item.price * item.quantity) - (item.discount || 0)).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="border-t border-dashed border-black mt-3 pt-2 text-xs">
        <div className="flex justify-between">
          <span>Subtotal:</span>
          <span>{subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Tax (8%):</span>
          <span>{tax.toFixed(2)}</span>
        </div>
        <div className="flex justify-between font-bold text-sm my-1">
          <span>TOTAL:</span>
          <span>{formatCurrency(sale.amount, 'USD')}</span>
        </div>
      </div>
      
       <div className="border-t border-dashed border-black mt-2 pt-2 text-xs">
           <h3 className="font-bold text-center mb-1">PAYMENTS</h3>
            {sale.payments.map((p, index) => (
                <div key={index} className="flex justify-between">
                    <span>{p.method}:</span>
                    <span>{formatCurrency(p.amount, 'USD')}</span>
                </div>
            ))}
      </div>

      <div className="text-center mt-4 text-xs">
        <p>Thank you for your business!</p>
        <p>Please come again.</p>
      </div>
    </div>
  );
};

export default Receipt;