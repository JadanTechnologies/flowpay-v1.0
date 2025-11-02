import React from 'react';
import { Check } from 'lucide-react';
// FIX: The `react-router-dom` module seems to have CJS/ESM interop issues in this environment. Using a namespace import as a workaround.
import * as ReactRouterDOM from 'react-router-dom';
const { Link } = ReactRouterDOM;
import { useAppContext } from '../../contexts/AppContext';

// Note: The plans themselves are managed in the Super Admin Subscriptions page, not here.
const plans = [
  {
    name: 'Basic',
    price: '$49',
    description: 'For small businesses getting started.',
    features: ['1 Branch', '5 Users', 'POS & Inventory', 'Basic Reporting'],
    isPopular: false,
  },
  {
    name: 'Pro',
    price: '$99',
    description: 'For growing businesses that need more.',
    features: ['5 Branches', '25 Users', 'Full Accounting', 'Advanced Reporting', 'API Access'],
    isPopular: true,
  },
  {
    name: 'Premium',
    price: 'Contact Us',
    description: 'For large enterprises with custom needs.',
    features: ['Unlimited Branches', 'Unlimited Users', 'Logistics & GPS', 'Dedicated Support', 'Custom Integrations'],
    isPopular: false,
  },
];

const PricingSection: React.FC = () => {
    const { settings } = useAppContext();
    const branding = settings?.branding;

  return (
    <section id="pricing" className="py-20 md:py-28 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">{branding?.pricingSectionTitle || 'Flexible Pricing for Teams of Any Size'}</h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
            {branding?.pricingSectionSubtitle || 'Choose a plan that fits your needs. All plans start with a 30-day free trial.'}
          </p>
        </div>
        <div className="mt-16 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div key={plan.name} className={`border rounded-xl p-8 flex flex-col ${plan.isPopular ? 'border-primary shadow-2xl scale-105' : 'border-gray-200 shadow-lg'}`}>
              {plan.isPopular && (
                <div className="text-center mb-4">
                  <span className="bg-secondary text-gray-900 text-sm font-bold px-4 py-1 rounded-full">{branding?.popularPlanBadgeText || 'Most Popular'}</span>
                </div>
              )}
              <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
              <p className="mt-2 text-gray-600">{plan.description}</p>
              <div className="mt-6">
                <span className="text-5xl font-extrabold text-gray-900">{plan.price}</span>
                {plan.price !== 'Contact Us' && <span className="text-lg text-gray-600">/ month</span>}
              </div>
              <ul className="mt-8 space-y-4 flex-grow">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start">
                    <Check className="w-6 h-6 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <Link to="/login" className={`block w-full text-center px-6 py-3 rounded-lg font-semibold ${plan.isPopular ? 'bg-primary text-white hover:bg-primary-dark' : 'bg-primary/10 text-primary hover:bg-primary/20'}`}>
                  {plan.price === 'Contact Us' ? (branding?.contactSalesButtonText || 'Contact Sales') : (branding?.mainCtaText || 'Start Free Trial')}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;