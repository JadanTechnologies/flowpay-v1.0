

import React from 'react';
import LandingNavbar from '../components/landing/LandingNavbar';
import HeroSection from '../components/landing/HeroSection';
import FeaturesSection from '../components/landing/FeaturesSection';
import PricingSection from '../components/landing/PricingSection';
import TestimonialsSection from '../components/landing/TestimonialsSection';
import FaqSection from '../components/landing/FaqSection';
import Footer from '../components/landing/Footer';


const LandingPage: React.FC = () => {
  return (
    <div className="bg-white text-gray-800 font-sans">
        <LandingNavbar />
        <main>
            <HeroSection />
            <FeaturesSection />
            <PricingSection />
            <TestimonialsSection />
            <FaqSection />
        </main>
        <Footer />
    </div>
  );
};

export default LandingPage;