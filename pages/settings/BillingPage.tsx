import React, { useState, useMemo } from 'react';
import { subscriptionPlans, userSubscription, paymentHistory, systemSettings } from '../../data/mockData';
import { SubscriptionPlan, UserSubscription } from '../../types';
import CurrentPlanCard from '../../components/settings/CurrentPlanCard';
import PaymentMethodCard from '../../components/settings/PaymentMethodCard';
import PlanComparison from '../../components/settings/PlanComparison';
import PaymentHistoryTable from '../../components/settings/PaymentHistoryTable';
import UpgradeModal from '../../components/settings/UpgradeModal';
import RecurringPaymentModal from '../../components/settings/RecurringPaymentModal';

const BillingPage: React.FC = () => {
  const [subscription, setSubscription] = useState<UserSubscription>(userSubscription);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [isRecurringModalOpen, setIsRecurringModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  
  const currentPlan = useMemo(() => subscriptionPlans.find(p => p.name.toLowerCase() === subscription.planId)!, [subscription.planId]);
  const enabledGateways = useMemo(() => systemSettings.paymentGateways.filter(gw => gw.enabled), []);

  const handleSelectPlan = (plan: SubscriptionPlan) => {
    if (plan.id !== currentPlan.id) {
      setSelectedPlan(plan);
      setIsUpgradeModalOpen(true);
    }
  };
  
  const handleConfirmUpgrade = () => {
    // In a real app, you would refetch subscription data here
    alert(`Successfully upgraded to ${selectedPlan?.name}!`);
    setIsUpgradeModalOpen(false);
    setSelectedPlan(null);
  };
  
  const handleSaveRecurringSettings = (updatedSubscription: UserSubscription) => {
    setSubscription(updatedSubscription);
    setIsRecurringModalOpen(false);
    alert('Recurring payment settings updated successfully!');
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-text-primary">Billing & Subscriptions</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
            <CurrentPlanCard plan={currentPlan} subscription={subscription} />
        </div>
        <div>
            <PaymentMethodCard subscription={subscription} onManage={() => setIsRecurringModalOpen(true)}/>
        </div>
      </div>

      <PlanComparison 
        plans={subscriptionPlans} 
        currentPlanId={currentPlan.id}
        onSelectPlan={handleSelectPlan}
      />
      
      <PaymentHistoryTable history={paymentHistory} />

      {isUpgradeModalOpen && selectedPlan && (
        <UpgradeModal
          plan={selectedPlan}
          onClose={() => setIsUpgradeModalOpen(false)}
          onConfirm={handleConfirmUpgrade}
          paymentGateways={enabledGateways}
        />
      )}

      {isRecurringModalOpen && (
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

export default BillingPage;