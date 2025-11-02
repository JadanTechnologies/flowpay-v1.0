import React from 'react';
import { UserSubscription } from '../../types';
import { CreditCard } from 'lucide-react';

interface PaymentMethodCardProps {
  subscription: UserSubscription;
  onManage: () => void;
}

const PaymentMethodCard: React.FC<PaymentMethodCardProps> = ({ subscription, onManage }) => {
    const { paymentMethod } = subscription;

  return (
    <div className="bg-background p-6 rounded-lg border border-border h-full flex flex-col">
      <h3 className="text-lg font-semibold text-text-primary mb-4">Payment Method</h3>
        {paymentMethod ? (
            <div className="flex-grow flex flex-col">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-surface rounded-md border border-border">
                        <CreditCard size={24} className="text-primary"/>
                    </div>
                    <div>
                        <p className="font-semibold text-text-primary">{paymentMethod.brand} ending in {paymentMethod.last4}</p>
                        <p className="text-sm text-text-secondary">Expires {String(paymentMethod.expiryMonth).padStart(2, '0')}/{paymentMethod.expiryYear}</p>
                    </div>
                </div>
                 <div className="mt-4">
                     <span className="px-2 py-1 text-xs font-medium text-green-300 bg-green-900 rounded-full">Active</span>
                </div>
            </div>
        ) : (
             <div className="flex-grow flex items-center justify-center">
                <p className="text-text-secondary text-sm">No payment method on file.</p>
            </div>
        )}
      <div className="mt-6">
        <button onClick={onManage} className="w-full bg-border hover:bg-border/70 text-text-primary font-semibold py-2 px-4 rounded-lg text-sm">
          Manage
        </button>
      </div>
    </div>
  );
};

export default PaymentMethodCard;
