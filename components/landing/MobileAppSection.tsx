import React from 'react';
import { useAppContext } from '../../contexts/AppContext';

const MobileAppSection: React.FC = () => {
    const { settings } = useAppContext();
    const branding = settings?.branding;

    return (
        <section id="mobile-app" className="py-20 md:py-28 bg-gray-900 text-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h2 className="text-3xl md:text-4xl font-extrabold">{branding?.mobileAppSectionTitle || 'Manage Your Business On The Go'}</h2>
                <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-300">
                    {branding?.mobileAppSectionSubtitle || 'Our mobile app for iOS and Android lets you view sales, manage inventory, and track your fleet from anywhere.'}
                </p>
                {/* Placeholder for app store badges */}
                <div className="mt-8 flex justify-center gap-4">
                    <p className="text-gray-400">(App store badges coming soon)</p>
                </div>
            </div>
        </section>
    );
};

export default MobileAppSection;
