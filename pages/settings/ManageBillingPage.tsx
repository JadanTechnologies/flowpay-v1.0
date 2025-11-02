import React, { useState, useMemo } from 'react';
import { userSubscription, subscriptionPlans } from '../../data/mockData';
import { UserSubscription } from '../../types';
import PaymentMethodCard from '../../components/settings/PaymentMethodCard';
import RecurringPaymentModal from '../../components/settings/RecurringPaymentModal';

const ManageBillingPage: React.FC = () => {
    const [subscription, setSubscription] = useState<UserSubscription>(userSubscription);
    const [isRecurringModalOpen, setIsRecurringModalOpen] = useState(false);
    
    const currentPlan = useMemo(() => subscriptionPlans.find(p => p.name.toLowerCase() === subscription.planId)!, [subscription.planId]);

    const handleSaveRecurringSettings = (updatedSubscription: UserSubscription) => {
        setSubscription(updatedSubscription);
        setIsRecurringModalOpen(false);
        alert('Recurring payment settings updated successfully!');
    };

    return (
        <div className="space-y-8">
            <h2 className="text-2xl font-bold text-text-primary mb-1">Billing Method</h2>
            <p className="text-text-secondary">Update your payment method and billing cycle.</p>
            <PaymentMethodCard subscription={subscription} onManage={() => setIsRecurringModalOpen(true)} />

            {isRecurringModalOpen && currentPlan && (
                <RecurringPaymentModal
                    subscription={subscription}
                    plan={currentPlan}
                    onClose={() => setIsRecurringModalOpen(false)}
                    onSave={handleSaveRecurringSettings}
                />
            )}
        </div>
    );
};

export default ManageBillingPage;
