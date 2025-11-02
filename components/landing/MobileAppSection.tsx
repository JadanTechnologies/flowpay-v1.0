
import React from 'react';
import { useAppContext } from '../../contexts/AppContext';

// SVG for Apple App Store button
const AppStoreButton: React.FC<{ href: string }> = ({ href }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className="inline-block transform transition-transform hover:scale-105">
        <svg width="160" height="53" viewBox="0 0 160 53" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="160" height="53" rx="10" fill="black"/>
            <path d="M37.125 21.83C37.125 19.33 38.875 18.25 41.5 18.25C44.125 18.25 45.75 19.33 45.75 21.83C45.75 24.41 44.25 25.41 41.5 25.41C38.75 25.41 37.125 24.41 37.125 21.83ZM43.375 21.83C43.375 20.17 42.625 19.25 41.5 19.25C40.375 19.25 39.5 20.17 39.5 21.83C39.5 23.5 40.25 24.41 41.5 24.41C42.75 24.41 43.375 23.5 43.375 21.83Z" fill="white"/>
            <path d="M26.78 14.88C28.66 13.5 30.14 13.02 32.06 13.02C34.58 13.02 36.1 14.3 36.1 16.62V25.3H33.82V16.86C33.82 15.38 33.14 14.7 31.94 14.7C30.7 14.7 29.58 15.42 29.02 16.54V25.3H26.74V16.82C26.74 15.54 26.26 14.7 25.06 14.7C23.82 14.7 22.7 15.42 22.14 16.54V25.3H19.86V13.26H22.14V14.38C22.82 13.54 23.82 13.02 25.22 13.02C25.7 13.02 26.22 13.14 26.78 13.42V14.88Z" fill="white"/>
            <text x="55" y="23" fontFamily="Arial, sans-serif" fontSize="10" fill="white" fontWeight="bold">Download on the</text>
            <text x="55" y="38" fontFamily="Arial, sans-serif" fontSize="16" fill="white" fontWeight="bold">App Store</text>
        </svg>
    </a>
);

// SVG for Google Play button
const GooglePlayButton: React.FC<{ href: string }> = ({ href }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className="inline-block transform transition-transform hover:scale-105">
        <svg width="179" height="53" viewBox="0 0 179 53" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="179" height="53" rx="10" fill="black"/>
            <path d="M25.73 17.58L29.31 24.1L25.73 30.62L16 24.1L25.73 17.58Z" fill="#00E06B"/>
            <path d="M16 24.1L18.3 26.66L25.73 30.62L22.21 24.1L16 24.1Z" fill="#00A048"/>
            <path d="M33.89 21.62L29.31 24.1L33.89 26.58C35.09 27.26 35.81 26.42 35.81 25.1V23.1C35.81 21.78 35.09 20.94 33.89 21.62Z" fill="#00C458"/>
            <path d="M22.21 24.1L25.73 17.58L18.3 21.54L16 24.1L22.21 24.1Z" fill="#00A048"/>
            <text x="48" y="23" fontFamily="Arial, sans-serif" fontSize="10" fill="white">GET IT ON</text>
            <text x="48" y="40" fontFamily="Arial, sans-serif" fontSize="18" fill="white" fontWeight="bold">Google Play</text>
        </svg>
    </a>
);

const MobileAppSection: React.FC = () => {
    const { settings } = useAppContext();
    const mobileSettings = settings?.mobileApp;
    const branding = settings?.branding;

    if (!mobileSettings || !mobileSettings.enabled) {
        return null;
    }

    // If a file is hosted, provide a placeholder direct download link. Otherwise, use store URL.
    const androidLink = mobileSettings.androidFileName ? '#download-android' : mobileSettings.storeUrlAndroid;
    const iosLink = mobileSettings.iosFileName ? '#download-ios' : mobileSettings.storeUrlIos;

    return (
        <section id="mobile-app" className="py-20 md:py-28 bg-gray-900 text-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h2 className="text-3xl md:text-4xl font-extrabold">
                    {branding?.mobileAppSectionTitle || 'FlowPay on the Go'}
                </h2>
                <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-300">
                    {branding?.mobileAppSectionSubtitle || 'Manage your business from anywhere. Download our mobile app to access key features right from your pocket.'}
                </p>
                <div className="mt-10 flex justify-center items-center gap-4 flex-wrap">
                    {mobileSettings.storeUrlIos && <AppStoreButton href={iosLink} />}
                    {mobileSettings.storeUrlAndroid && <GooglePlayButton href={androidLink} />}
                </div>
            </div>
        </section>
    );
};

export default MobileAppSection;
