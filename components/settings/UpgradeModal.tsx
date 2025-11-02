import React, { useState } from 'react';
import { X, CreditCard, Banknote, Landmark, CheckCircle, AlertTriangle, Loader } from 'lucide-react';
import { SubscriptionPlan, PaymentGateway, PaymentGatewayId } from '../../types';
import { handlePaymentProcessing } from '../../lib/payment';
import { useAppContext } from '../../contexts/AppContext';
import { formatCurrency } from '../../utils/formatting';

interface UpgradeModalProps {
  plan: SubscriptionPlan;
  paymentGateways: PaymentGateway[];
  onClose: () => void;
  onConfirm: () => void;
}

const GatewayIcon: React.FC<{id: PaymentGatewayId}> = ({ id }) => {
    switch(id) {
        case 'paystack':
        case 'flutterwave':
        case '2checkout':
        case 'googlepay':
            return <CreditCard className="w-5 h-5" />;
        case 'monnify':
        case 'wise':
        case 'payoneer':
            return <Landmark className="w-5 h-5" />;
        case 'manual':
            return <Banknote className="w-5 h-5" />;
        default:
            return <CreditCard className="w-5 h-5" />;
    }
}

const UpgradeModal: React.FC<UpgradeModalProps> = ({ plan, paymentGateways, onClose, onConfirm }) => {
  const [selectedGateway, setSelectedGateway] = useState<PaymentGatewayId | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const { currency } = useAppContext();

  const handleProcessPayment = async () => {
    if (!selectedGateway) return;
    
    const gateway = paymentGateways.find(g => g.id === selectedGateway);
    if (!gateway) return;

    setIsProcessing(true);
    setErrorMessage('');

    const result = await handlePaymentProcessing(plan, gateway);

    setIsProcessing(false);

    if (result.success) {
      setPaymentSuccess(true);
      setTimeout(() => {
        onConfirm();
      }, 2000);
    } else {
      setErrorMessage(result.message);
    }
  };
  
  const renderContent = () => {
    if (isProcessing) {
        return (
            <div className="text-center p-12">
                <Loader className="animate-spin text-primary mx-auto mb-4" size={48} />
                <h3 className="text-xl font-semibold text-text-primary">Processing Payment...</h3>
                <p className="text-text-secondary">Please do not close this window.</p>
            </div>
        )
    }
    
    if (paymentSuccess) {
         return (
            <div className="text-center p-12">
                <CheckCircle className="text-green-500 mx-auto mb-4" size={48} />
                <h3 className="text-xl font-semibold text-text-primary">Upgrade Successful!</h3>
                <p className="text-text-secondary">Welcome to the {plan.name} plan. Redirecting...</p>
            </div>
        )
    }

    return (
      <>
        <div className="flex justify-between items-center p-4 border-b border-border">
          <h2 className="text-xl font-bold text-text-primary">Confirm Upgrade</h2>
          <button onClick={onClose} className="text-text-secondary hover:text-text-primary"><X size={24} /></button>
        </div>

        <div className="p-6">
          <p className="text-text-secondary mb-4">You are upgrading to the <span className="font-bold text-primary">{plan.name}</span> plan for <span className="font-bold text-primary">{formatCurrency(plan.price, currency)}/month</span>.</p>
          
          <h4 className="font-semibold text-text-primary mb-2">Select Payment Method</h4>
          <div className="space-y-2">
            {paymentGateways.map(gateway => (
              <button 
                key={gateway.id}
                onClick={() => setSelectedGateway(gateway.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-lg border-2 text-left transition-colors ${selectedGateway === gateway.id ? 'border-primary bg-primary/10' : 'border-border hover:border-gray-600'}`}
              >
                <GatewayIcon id={gateway.id} />
                <span className="font-semibold">{gateway.name}</span>
              </button>
            ))}
          </div>
          {errorMessage && (
            <div className="mt-4 flex items-center gap-2 text-sm text-red-400 bg-red-900/50 p-3 rounded-lg">
                <AlertTriangle size={16}/> {errorMessage}
            </div>
          )}
        </div>

        <div className="p-4 bg-background rounded-b-xl">
          <button 
            onClick={handleProcessPayment} 
            disabled={!selectedGateway || isProcessing}
            className="w-full bg-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-primary-dark transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            Confirm & Pay {formatCurrency(plan.price, currency)}
          </button>
        </div>
      </>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-surface rounded-xl shadow-lg w-full max-w-md border border-border">
        {renderContent()}
      </div>
    </div>
  );
};

export default UpgradeModal;
