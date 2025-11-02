import React from 'react';
// FIX: The `react-router-dom` module seems to have CJS/ESM interop issues in this environment. Using a namespace import as a workaround.
import { Link } from 'react-router-dom';
import { useAppContext } from '../../contexts/AppContext';

const HeroSection: React.FC = () => {
    const { settings } = useAppContext();
    const branding = settings?.branding;
    
    const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        e.preventDefault();
        if (href.startsWith('#')) {
            const id = href.substring(1);
            const element = document.getElementById(id);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        }
    };

  return (
    <section className="py-20 md:py-32 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 
          className="text-4xl md:text-6xl font-extrabold text-gray-900 leading-tight"
          dangerouslySetInnerHTML={{ __html: branding?.heroTitle || 'The All-In-One <span class="text-primary">POS & Logistics</span> Platform' }}
        >
        </h1>
        <p className="mt-6 max-w-2xl mx-auto text-lg md:text-xl text-gray-600">
          {branding?.heroSubtitle || 'FlowPay combines Point of Sale, Inventory, Accounting, and GPS Tracking into one seamless, powerful SaaS solution designed for B2B success.'}
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Link to="/login" className="px-8 py-3 bg-primary text-white rounded-lg font-semibold text-lg hover:bg-primary-dark transition-transform hover:scale-105">
            {branding?.heroMainCtaText || 'Start Your 30-Day Free Trial'}
          </Link>
          <a href="#features" onClick={(e) => handleScroll(e, '#features')} className="px-8 py-3 bg-white text-primary border-2 border-primary rounded-lg font-semibold text-lg hover:bg-primary/5 transition-transform hover:scale-105">
            {branding?.heroSecondaryCtaText || 'Explore Features'}
          </a>
        </div>
        
        {branding?.heroStats && branding.heroStats.length > 0 && (
            <div className="mt-16 flex flex-wrap justify-center gap-8 md:gap-16">
                {branding.heroStats.map((stat, index) => (
                    <div key={index} className="text-center">
                        <p className="text-4xl md:text-5xl font-bold text-primary">{stat.value}</p>
                        <p className="mt-2 text-sm md:text-base text-gray-500 tracking-wider uppercase">{stat.label}</p>
                    </div>
                ))}
            </div>
        )}
      </div>
    </section>
  );
};

export default HeroSection;