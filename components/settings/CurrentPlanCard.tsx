
import React from 'react';
import { SubscriptionPlan, UserSubscription } from '../../types';
import ProgressBar from '../ui/ProgressBar';

interface CurrentPlanCardProps {
  plan: SubscriptionPlan;
  subscription: UserSubscription;
}

const CurrentPlanCard: React.FC<CurrentPlanCardProps> = ({ plan, subscription }) => {
  const getTrialDaysLeft = () => {
    if (subscription.status !== 'trial' || !subscription.trialEnds) return 0;
    const diff = new Date(subscription.trialEnds).getTime() - new Date().getTime();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  const trialDaysLeft = getTrialDaysLeft();
  const billingCycleText = subscription.billingCycle === 'monthly' ? 'Billed Monthly' : 'Billed Yearly';

  const renderBillingInfo = () => {
    if (subscription.status === 'trial' && subscription.trialEnds) {
      return (
        <div className="text-right">
            <p className="text-sm font-medium text-text-primary">Trial Period</p>
            <p className="text-xs text-text-secondary">Trial ends on {new Date(subscription.trialEnds).toLocaleDateString()}</p>
        </div>
      );
    }
    if (subscription.status === 'active' && subscription.nextBillingDate) {
      return (
        <div className="text-right">
            <p className="text-sm font-medium text-text-primary">Auto-renewal is <span className={subscription.recurringPayment.enabled ? 'text-green-400' : 'text-red-400'}>{subscription.recurringPayment.enabled ? 'ON' : 'OFF'}</span></p>
            <p className="text-xs text-text-secondary">Next bill on {new Date(subscription.nextBillingDate).toLocaleDateString()}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-background p-6 rounded-lg border border-border h-full flex flex-col">
      <h3 className="text-lg font-semibold text-text-primary mb-1">Current Plan</h3>
      <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-4 mb-4">
        <span className="text-2xl font-bold text-primary">{plan.name} Plan</span>
        <div className="flex items-center gap-2">
            <span className="text-sm text-text-secondary">{billingCycleText}</span>
            {subscription.status === 'trial' && (
              <span className="text-xs font-medium text-yellow-400 bg-yellow-900/50 px-2 py-1 rounded-full">
                Trial ({trialDaysLeft} days left)
              </span>
            )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-text-secondary">Users</span>
            <span className="font-medium text-text-primary">{subscription.currentUsers} / {plan.userLimit}</span>
          </div>
          <ProgressBar value={subscription.currentUsers} max={plan.userLimit} />
        </div>
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-text-secondary">Branches</span>
            <span className="font-medium text-text-primary">{subscription.currentBranches} / {plan.branchLimit}</span>
          </div>
          <ProgressBar value={subscription.currentBranches} max={plan.branchLimit} />
        </div>
      </div>
      
      <div className="mt-6 flex justify-between items-center">
        <button className="bg-red-600/20 text-red-400 font-semibold py-2 px-4 rounded-lg hover:bg-red-600/40 text-sm">
          Cancel Subscription
        </button>
        {renderBillingInfo()}
      </div>
    </div>
  );
};

export default CurrentPlanCard;