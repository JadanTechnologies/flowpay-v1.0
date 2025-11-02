import React, { useState, useMemo } from 'react';
import { subscriptionPlans, userSubscription, systemSettings } from '../../data/mockData';
import { SubscriptionPlan } from '../../types';
import CurrentPlanCard from '../../components/settings/CurrentPlanCard';
import PlanComparison from '../../components/settings/PlanComparison';
import UpgradeModal from '../../components/settings/UpgradeModal';

const ViewSubscriptionDetailsPage: React.FC = () => {
    const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);

    const currentPlan = useMemo(() => subscriptionPlans.find(p => p.name.toLowerCase() === userSubscription.planId)!, []);
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

    return (
        <div className="space-y-8">
            <h2 className="text-2xl font-bold text-text-primary mb-1">Subscription</h2>
            <p className="text-text-secondary">View your current plan details or upgrade to a new plan.</p>
            <CurrentPlanCard plan={currentPlan} subscription={userSubscription} />
            <PlanComparison 
                plans={subscriptionPlans} 
                currentPlanId={currentPlan.id}
                onSelectPlan={handleSelectPlan}
            />
            {isUpgradeModalOpen && selectedPlan && (
                <UpgradeModal
                plan={selectedPlan}
                onClose={() => setIsUpgradeModalOpen(false)}
                onConfirm={handleConfirmUpgrade}
                paymentGateways={enabledGateways}
                />
            )}
        </div>
    );
};

export default ViewSubscriptionDetailsPage;
