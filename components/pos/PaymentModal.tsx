import React, { useState, useMemo, FC, ChangeEvent } from 'react';
import { X, CreditCard, Banknote, Smartphone, Handshake } from 'lucide-react';
import { Payment, Customer, Sale } from '../../types';
import { useAppContext } from '../../contexts/AppContext';
import { formatCurrency } from '../../utils/formatting';

interface PaymentModalProps {
  totalAmount: number;
  customer: Customer | undefined;
  onClose: () => void;
  onConfirm: (payments: Payment[], finalStatus: Sale['status'], customer: Customer) => void;
}

type PaymentMethod = 'Cash' | 'Card' | 'Transfer';
type PaymentAmounts = Record<PaymentMethod, string>;

const PaymentModal: FC<PaymentModalProps> = ({ totalAmount, customer, onClose, onConfirm }) => {
  const [amounts, setAmounts] = useState<PaymentAmounts>({ Cash: '', Card: '', Transfer: '' });
  const { currency, addNotification } = useAppContext();

  const handleAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target as { name: PaymentMethod, value: string };
    
    // Allow only numbers and a single decimal point
    if (/^\d*\.?\d{0,2}$/.test(value)) {
        setAmounts(prev => ({ ...prev, [name]: value }));
    }
  };

  const totalPaid = useMemo(() => {
    return Object.values(amounts).reduce((sum: number, val) => sum + (parseFloat(val as string) || 0), 0);
  }, [amounts]);
  
  const remainingBalance = totalAmount - totalPaid;
  
  const handleFinalize = () => {
    if (!customer) {
        addNotification({ message: 'Error: Customer information is missing.', type: 'error' });
        return;
    }
    const appliedPayments: Payment[] = Object.entries(amounts)
        .filter(([, amount]) => parseFloat(amount as string) > 0)
        .map(([method, amount]) => ({
            method: method as PaymentMethod,
            amount: parseFloat(amount as string),
        }));
    
    if(remainingBalance > 0) {
       if (customer.id === 'cust_4') { // 'cust_4' is the Walk-in Customer
           addNotification({ message: 'A specific customer must be selected to process a sale on credit.', type: 'error' });
           return;
       }
       if(window.confirm(`Finalize sale with an outstanding balance of ${formatCurrency(remainingBalance, currency)} on credit for ${customer.name}?`)) {
          onConfirm(appliedPayments, 'Credit', customer);
      }
    } else {
       onConfirm(appliedPayments, 'Paid', customer);
    }
  }
  
  const canFinalize = totalPaid > 0 || (customer && customer.id !== 'cust_4' && remainingBalance > 0);
  
  const paymentMethods: { name: PaymentMethod; icon: React.ReactNode; }[] = [
      { name: 'Cash', icon: <Banknote /> },
      { name: 'Card', icon: <CreditCard /> },
      { name: 'Transfer', icon: <Smartphone /> },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-surface rounded-xl shadow-lg w-full max-w-2xl border border-border">
        <div className="flex justify-between items-center p-4 border-b border-border">
          <h2 className="text-xl font-bold text-text-primary">Process Payment</h2>
          <button onClick={onClose} className="text-text-secondary hover:text-text-primary"><X size={24} /></button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Left - Payment Entry */}
            <div className="p-6 border-r border-border space-y-4">
                <h3 className="font-semibold text-text-primary">Enter Payment Amounts</h3>
                {paymentMethods.map(({name, icon}) => (
                     <div key={name}>
                        <label className="text-sm font-medium text-text-secondary flex items-center justify-between mb-1">
                            <span className="flex items-center gap-2">
                                {icon} {name}
                            </span>
                        </label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary">{new Intl.NumberFormat().format(0).replace('0', '')}</span>
                            <input
                                type="text"
                                name={name}
                                value={amounts[name]}
                                onChange={handleAmountChange}
                                placeholder="0.00"
                                className="bg-background border border-border rounded-lg pl-7 pr-2 py-2 w-full focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>
                    </div>
                ))}
            </div>
            
            {/* Right - Summary */}
            <div className="p-6 flex flex-col">
                <h3 className="font-semibold text-text-primary mb-4">Order Summary</h3>
                <div className="space-y-2 text-lg mb-4">
                    <div className="flex justify-between"><span className="text-text-secondary">Total</span><span className="font-bold text-text-primary">{formatCurrency(totalAmount, currency)}</span></div>
                    <div className="flex justify-between"><span className="text-text-secondary">Paid</span><span className="font-bold text-green-400">{formatCurrency(totalPaid, currency)}</span></div>
                    <div className={`flex justify-between font-bold text-xl py-2 border-y border-border ${remainingBalance <= 0 ? 'text-secondary' : 'text-red-400'}`}>
                        <span>{remainingBalance <= 0 ? 'Change Due' : 'Balance Due'}</span>
                        <span>{formatCurrency(Math.abs(remainingBalance), currency)}</span>
                    </div>
                </div>

                <div className="mt-auto pt-4 flex flex-col gap-2">
                    <button onClick={handleFinalize} disabled={!canFinalize} className="w-full bg-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-primary-dark transition-colors disabled:bg-gray-700 disabled:text-text-secondary disabled:cursor-not-allowed">
                       {remainingBalance > 0 && customer && customer.id !== 'cust_4' ? 'Finalize with Credit' : 'Finalize Sale'}
                    </button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
