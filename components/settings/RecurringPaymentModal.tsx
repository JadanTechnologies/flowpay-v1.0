import React, { useState, useMemo } from 'react';
import { SubscriptionPlan, UserSubscription } from '../../types';
import Modal from '../ui/Modal';
import ToggleSwitch from '../ui/ToggleSwitch';

interface RecurringPaymentModalProps {
    subscription: UserSubscription;
    plan: SubscriptionPlan;
    onClose: () => void;
    onSave: (updatedSubscription: UserSubscription) => void;
}

const RecurringPaymentModal: React.FC<RecurringPaymentModalProps> = ({ subscription, plan, onClose, onSave }) => {
    const [isEnabled, setIsEnabled] = useState(subscription.recurringPayment.enabled);
    const [billingCycle, setBillingCycle] = useState(subscription.billingCycle);
    const [cardDetails, setCardDetails] = useState({
        number: `**** **** **** ${subscription.paymentMethod?.last4 || '0000'}`,
        expiry: `${String(subscription.paymentMethod?.expiryMonth || '12').padStart(2, '0')}/${String(subscription.paymentMethod?.expiryYear || '2025').slice(-2)}`,
        cvc: '***'
    });
    
    const yearlyPrice = plan.price * 12 * 0.8; // Assume 20% discount for yearly
    const monthlyPrice = plan.price;
    const savings = (plan.price * 12) - yearlyPrice;

    const getNextBillingDate = () => {
        const today = new Date();
        if (billingCycle === 'monthly') {
            today.setMonth(today.getMonth() + 1);
        } else {
            today.setFullYear(today.getFullYear() + 1);
        }
        return today.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    }

    const handleSave = () => {
        // This is a mock save. In a real app, you'd validate and tokenize the card.
        const newLast4 = cardDetails.number.slice(-4);
        const [expMonth, expYear] = cardDetails.expiry.split('/');
        
        const updatedSubscription: UserSubscription = {
            ...subscription,
            billingCycle: billingCycle,
            recurringPayment: {
                ...subscription.recurringPayment,
                enabled: isEnabled,
            },
            paymentMethod: {
                ...subscription.paymentMethod!,
                last4: newLast4,
                expiryMonth: parseInt(expMonth),
                expiryYear: 2000 + parseInt(expYear),
            }
        };
        onSave(updatedSubscription);
    }
    
    return (
        <Modal title="Manage Recurring Payment" onClose={onClose}>
            <div className="p-6 space-y-6">
                <div className="flex justify-between items-center bg-background p-4 rounded-lg border border-border">
                    <div>
                        <p className="font-medium text-text-primary">Enable Auto-Renewal</p>
                        <p className="text-sm text-text-secondary">Your subscription will renew automatically.</p>
                    </div>
                    <ToggleSwitch checked={isEnabled} onChange={setIsEnabled} />
                </div>
                
                {isEnabled && (
                    <>
                        <div>
                            <h4 className="font-semibold text-text-primary mb-2">Billing Frequency</h4>
                            <div className="grid grid-cols-2 gap-2">
                                <button onClick={() => setBillingCycle('monthly')} className={`p-4 rounded-lg border-2 text-left ${billingCycle === 'monthly' ? 'border-primary bg-primary/10' : 'border-border'}`}>
                                    <p className="font-bold">Monthly</p>
                                    <p className="text-sm">${monthlyPrice}/month</p>
                                </button>
                                <button onClick={() => setBillingCycle('yearly')} className={`p-4 rounded-lg border-2 text-left relative ${billingCycle === 'yearly' ? 'border-primary bg-primary/10' : 'border-border'}`}>
                                     <span className="absolute -top-2.5 right-2 bg-secondary text-background text-xs font-bold px-2 py-0.5 rounded-full">Save ${savings.toFixed(0)}!</span>
                                    <p className="font-bold">Yearly</p>
                                    <p className="text-sm">${yearlyPrice.toFixed(0)}/year</p>
                                </button>
                            </div>
                        </div>

                        <div>
                             <h4 className="font-semibold text-text-primary mb-2">Payment Card</h4>
                             <div className="space-y-3">
                                <input type="text" placeholder="Card Number" value={cardDetails.number} onChange={e => setCardDetails({...cardDetails, number: e.target.value})} className="w-full bg-background border border-border rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary text-sm"/>
                                <div className="grid grid-cols-2 gap-3">
                                    <input type="text" placeholder="MM/YY" value={cardDetails.expiry} onChange={e => setCardDetails({...cardDetails, expiry: e.target.value})} className="w-full bg-background border border-border rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary text-sm"/>
                                    <input type="text" placeholder="CVC" value={cardDetails.cvc} onChange={e => setCardDetails({...cardDetails, cvc: e.target.value})} className="w-full bg-background border border-border rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary text-sm"/>
                                </div>
                             </div>
                        </div>
                         <p className="text-center text-sm text-text-secondary">Your next payment will be on {getNextBillingDate()}.</p>
                    </>
                )}
            </div>

            <div className="p-4 bg-background rounded-b-xl flex justify-end gap-2">
                <button type="button" onClick={onClose} className="bg-border hover:bg-border/70 text-text-primary font-semibold py-2 px-4 rounded-lg text-sm">Cancel</button>
                <button type="button" onClick={handleSave} className="bg-primary hover:bg-primary-dark text-white font-semibold py-2 px-4 rounded-lg text-sm">Save Changes</button>
            </div>
        </Modal>
    )
}

export default RecurringPaymentModal;