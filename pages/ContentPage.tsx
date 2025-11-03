import React from 'react';
import LandingNavbar from '../components/landing/LandingNavbar';
import Footer from '../components/landing/Footer';
import { useAppContext } from '../contexts/AppContext';
import { Loader } from 'lucide-react';

interface ContentPageProps {
    title: string;
    contentKey: string;
    settingsKey: 'settings' | 'branding';
}

const ContentPage: React.FC<ContentPageProps> = ({ title, contentKey, settingsKey }) => {
    const { settings } = useAppContext();

    if (!settings) {
        return <div className="flex h-screen w-full items-center justify-center bg-background"><Loader className="animate-spin text-primary" size={48} /></div>;
    }

    const contentSource = settingsKey === 'branding' ? settings.branding : settings;
    // @ts-ignore
    const content = contentSource ? contentSource[contentKey] : 'Content not found.';
    
    return (
        <div className="bg-white text-gray-800 font-sans">
            <LandingNavbar />
            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="prose lg:prose-xl max-w-4xl mx-auto">
                    <h1 className="text-4xl font-bold mb-8">{title}</h1>
                    <div className="bg-gray-50 p-6 rounded-lg whitespace-pre-wrap font-mono text-sm">{content}</div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default ContentPage;