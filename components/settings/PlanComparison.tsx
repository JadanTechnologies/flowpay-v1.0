import React from 'react';
import { SubscriptionPlan } from '../../types';
import { Check } from 'lucide-react';
import { useAppContext } from '../../contexts/AppContext';
import { formatCurrency } from '../../utils/formatting';

interface PlanComparisonProps {
  plans: SubscriptionPlan[];
  currentPlanId: string;
  onSelectPlan: (plan: SubscriptionPlan) => void;
}

const PlanComparison: React.FC<PlanComparisonProps> = ({ plans, currentPlanId, onSelectPlan }) => {
  const { currency } = useAppContext();
  
  return (
    <div className="bg-background p-6 rounded-lg border border-border">
        <h3 className="text-lg font-semibold text-text-primary mb-4">Upgrade Your Plan</h3>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div key={plan.id} className={`border-2 rounded-xl p-6 flex flex-col ${currentPlanId === plan.id ? 'border-primary' : 'border-border'}`}>
              <h4 className="text-xl font-bold text-text-primary">{plan.name}</h4>
              <p className="text-text-secondary text-sm mt-1 h-10">{plan.description}</p>
              <div className="mt-4">
                <span className="text-4xl font-extrabold text-text-primary">{formatCurrency(plan.price, currency)}</span>
                <span className="text-text-secondary">/ month</span>
              </div>
              <ul className="mt-6 space-y-3 flex-grow">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-text-secondary text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6">
                <button 
                  onClick={() => onSelectPlan(plan)}
                  disabled={currentPlanId === plan.id}
                  className="w-full text-center px-6 py-2.5 rounded-lg font-semibold transition-colors disabled:cursor-not-allowed disabled:bg-surface disabled:text-text-secondary
                  bg-primary text-white hover:bg-primary-dark"
                >
                  {currentPlanId === plan.id ? 'Current Plan' : 'Upgrade'}
                </button>
              </div>
            </div>
          ))}
        </div>
    </div>
  );
};

export default PlanComparison;
