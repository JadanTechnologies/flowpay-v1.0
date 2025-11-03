import React, { useState } from 'react';
import { Check } from 'lucide-react';
// FIX: The `react-router-dom` module seems to have CJS/ESM interop issues in this environment. Using a namespace import as a workaround.
import { Link } from 'react-router-dom';
import { useAppContext } from '../../contexts/AppContext';

// Note: The plans themselves are managed in the Super Admin Subscriptions page, not here.
const plansData = [
  {
    name: 'Basic',
    priceMonthly: 49,
    priceYearly: 470, // approx 20% discount
    description: 'For small businesses getting started.',
    features: ['1 Branch', '5 Users', 'POS & Inventory', 'Basic Reporting'],
    isPopular: false,
  },
  {
    name: 'Pro',
    priceMonthly: 99,
    priceYearly: 950, // approx 20% discount
    description: 'For growing businesses that need more.',
    features: ['5 Branches', '25 Users', 'Full Accounting', 'Advanced Reporting', 'API Access'],
    isPopular: true,
  },
  {
    name: 'Premium',
    priceMonthly: 0, // Contact Us
    priceYearly: 0, // Contact Us
    description: 'For large enterprises with custom needs.',
    features: ['Unlimited Branches', 'Unlimited Users', 'Logistics & GPS', 'Dedicated Support', 'Custom Integrations'],
    isPopular: false,
  },
];

const PricingSection: React.FC = () => {
    const { settings } = useAppContext();
    const branding = settings?.branding;
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  return (
    <section id="pricing" className="py-20 md:py-28 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">{branding?.pricingSectionTitle || 'Flexible Pricing for Teams of Any Size'}</h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
            {branding?.pricingSectionSubtitle || 'Choose a plan that fits your needs. All plans start with a 30-day free trial.'}
          </p>
        </div>

        <div className="mt-12 flex justify-center items-center gap-4">
            <span className={`font-semibold transition-colors ${billingCycle === 'monthly' ? 'text-primary' : 'text-gray-600'}`}>Monthly</span>
            <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={billingCycle === 'yearly'} onChange={() => setBillingCycle(prev => prev === 'monthly' ? 'yearly' : 'monthly')} className="sr-only peer" />
                <div className="w-14 h-7 bg-gray-200 rounded-full peer peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/30 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
            <span className={`font-semibold transition-colors ${billingCycle === 'yearly' ? 'text-primary' : 'text-gray-600'}`}>
                Yearly
                <span className="ml-2 text-sm font-normal bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Save ~20%</span>
            </span>
        </div>

        <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {plansData.map((plan) => {
            const isContactUs = plan.priceMonthly === 0;
            const price = billingCycle === 'monthly' ? plan.priceMonthly : plan.priceYearly;
            const period = billingCycle === 'monthly' ? '/ month' : '/ year';
            
            return (
                <div key={plan.name} className={`bg-white border rounded-xl p-8 flex flex-col transition-all duration-300 ${plan.isPopular ? 'border-primary shadow-2xl scale-105' : 'border-gray-200 shadow-lg'}`}>
                {plan.isPopular && (
                    <div className="text-center mb-4">
                    <span className="bg-secondary text-gray-900 text-sm font-bold px-4 py-1 rounded-full">{branding?.popularPlanBadgeText || 'Most Popular'}</span>
                    </div>
                )}
                <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
                <p className="mt-2 text-gray-600 h-12">{plan.description}</p>
                <div className="mt-6">
                    <span className="text-5xl font-extrabold text-gray-900">{isContactUs ? 'Contact Us' : `$${price}`}</span>
                    {!isContactUs && <span className="text-lg text-gray-600">{period}</span>}
                     {billingCycle === 'yearly' && !isContactUs && (
                        <p className="text-sm text-gray-500 mt-1">
                            equivalent to ${Math.round(price / 12)}/month
                        </p>
                     )}
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
                    <Link to="/login" className={`block w-full text-center px-6 py-3 rounded-lg font-semibold transition-colors ${plan.isPopular ? 'bg-primary text-white hover:bg-primary-dark' : 'bg-primary/10 text-primary hover:bg-primary/20'}`}>
                    {isContactUs ? (branding?.contactSalesButtonText || 'Contact Sales') : (branding?.mainCtaText || 'Start Free Trial')}
                    </Link>
                </div>
                </div>
            )
          })}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;