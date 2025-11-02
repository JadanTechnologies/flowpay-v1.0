import React from 'react';
import { ShoppingCart, Package, BookOpen, Truck, Users, BarChart, Zap } from 'lucide-react';
import { useAppContext } from '../../contexts/AppContext';

const iconMap: { [key: string]: React.ReactNode } = {
  ShoppingCart: <ShoppingCart size={32} className="text-primary" />,
  Package: <Package size={32} className="text-primary" />,
  BookOpen: <BookOpen size={32} className="text-primary" />,
  Truck: <Truck size={32} className="text-primary" />,
  Users: <Users size={32} className="text-primary" />,
  BarChart: <BarChart size={32} className="text-primary" />,
  Zap: <Zap size={32} className="text-primary" />,
};

const FeaturesSection: React.FC = () => {
  const { settings } = useAppContext();
  const branding = settings?.branding;
  const features = branding?.features || [];

  return (
    <section id="features" className="py-20 md:py-28">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">{branding?.featuresSectionTitle || 'Everything Your Business Needs'}</h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
            {branding?.featuresSectionSubtitle || "FlowPay is more than just a POS. It's a complete ecosystem to manage and grow your business."}
          </p>
        </div>
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-gray-50 p-8 rounded-xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all">
              <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 mb-6">
                {iconMap[feature.icon] || <BarChart size={32} className="text-primary" />}
              </div>
              <h3 className="text-xl font-bold text-gray-900">{feature.title}</h3>
              <p className="mt-2 text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;