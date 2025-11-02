import React, { useState } from 'react';
import { Upload } from 'lucide-react';
import { useAppContext, Language, Currency } from '../../contexts/AppContext';

const ProfilePage: React.FC = () => {
    const { currency, setCurrency, language, setLanguage, addNotification, tenantSettings, setTenantSettings } = useAppContext();
    const [profile, setProfile] = useState({
        fullName: 'Admin User',
        email: 'admin@flowpay.com',
        avatar: 'https://picsum.photos/seed/user/100/100',
    });
    const [businessProfile, setBusinessProfile] = useState(tenantSettings?.businessProfile || {
        companyName: '',
        address: '',
        phone: '',
        email: '',
        logoUrl: '',
        taxId: ''
    });

    const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };

    const handleBusinessProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setBusinessProfile({ ...businessProfile, [e.target.name]: e.target.value });
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (tenantSettings) {
            setTenantSettings({ ...tenantSettings, businessProfile });
        }
        addNotification({ message: 'Profile and business details updated successfully!', type: 'success' });
    }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 divide-y divide-border">
      {/* Profile Section */}
      <div>
        <h2 className="text-xl font-bold text-text-primary mb-1">Profile</h2>
        <p className="text-sm text-text-secondary mb-6">This information is for your user account.</p>
        <div className="flex items-center gap-6">
            <img src={profile.avatar} alt="Avatar" className="w-20 h-20 rounded-full" />
            <div className="relative">
                <button type="button" className="bg-background border border-border rounded-md px-4 py-2 text-sm font-semibold hover:bg-border">Change</button>
                <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
            </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-text-secondary mb-1">Full Name</label>
                <input type="text" name="fullName" id="fullName" value={profile.fullName} onChange={handleProfileChange} className="w-full bg-background border border-border rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary text-sm" />
            </div>
             <div>
                <label htmlFor="email" className="block text-sm font-medium text-text-secondary mb-1">Email Address</label>
                <input type="email" name="email" id="email" value={profile.email} onChange={handleProfileChange} className="w-full bg-background border border-border rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary text-sm" />
            </div>
        </div>
      </div>

      {/* Business Profile Section */}
      <div className="pt-8">
         <h2 className="text-xl font-bold text-text-primary mb-1">Business & Invoice Details</h2>
        <p className="text-sm text-text-secondary mb-6">This information will appear on your receipts and invoices.</p>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <label htmlFor="companyName" className="block text-sm font-medium text-text-secondary mb-1">Company Name</label>
                <input type="text" name="companyName" id="companyName" value={businessProfile.companyName} onChange={handleBusinessProfileChange} className="w-full bg-background border border-border rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary text-sm" />
            </div>
             <div>
                <label htmlFor="taxId" className="block text-sm font-medium text-text-secondary mb-1">Tax ID / VAT Number</label>
                <input type="text" name="taxId" id="taxId" value={businessProfile.taxId} onChange={handleBusinessProfileChange} className="w-full bg-background border border-border rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary text-sm" />
            </div>
             <div>
                <label htmlFor="phone" className="block text-sm font-medium text-text-secondary mb-1">Public Phone</label>
                <input type="text" name="phone" id="phone" value={businessProfile.phone} onChange={handleBusinessProfileChange} className="w-full bg-background border border-border rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary text-sm" />
            </div>
             <div>
                <label htmlFor="businessEmail" className="block text-sm font-medium text-text-secondary mb-1">Public Email</label>
                <input type="email" name="email" id="businessEmail" value={businessProfile.email} onChange={handleBusinessProfileChange} className="w-full bg-background border border-border rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary text-sm" />
            </div>
             <div className="md:col-span-2">
                <label htmlFor="address" className="block text-sm font-medium text-text-secondary mb-1">Company Address</label>
                <input type="text" name="address" id="address" value={businessProfile.address} onChange={handleBusinessProfileChange} className="w-full bg-background border border-border rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary text-sm" />
            </div>
             <div className="md:col-span-2">
                <label htmlFor="logoUrl" className="block text-sm font-medium text-text-secondary mb-1">Logo URL</label>
                <input type="text" name="logoUrl" id="logoUrl" value={businessProfile.logoUrl} onChange={handleBusinessProfileChange} className="w-full bg-background border border-border rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary text-sm" />
            </div>
        </div>
      </div>

      {/* Preferences Section */}
      <div className="pt-8">
         <h2 className="text-xl font-bold text-text-primary mb-1">Preferences</h2>
        <p className="text-sm text-text-secondary mb-6">Choose your language and currency.</p>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <label htmlFor="language" className="block text-sm font-medium text-text-secondary mb-1">Language</label>
                <select id="language" value={language} onChange={(e) => setLanguage(e.target.value as Language)} className="w-full bg-background border border-border rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary text-sm">
                    <option value="en">English</option>
                    <option value="es">Español (Spanish)</option>
                    <option value="fr">Français (French)</option>
                </select>
            </div>
             <div>
                <label htmlFor="currency" className="block text-sm font-medium text-text-secondary mb-1">Currency</label>
                 <select id="currency" value={currency} onChange={(e) => setCurrency(e.target.value as Currency)} className="w-full bg-background border border-border rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary text-sm">
                    <option value="USD">USD - United States Dollar</option>
                    <option value="EUR">EUR - Euro</option>
                    <option value="NGN">NGN - Nigerian Naira</option>
                </select>
            </div>
        </div>
      </div>
      
       <div className="pt-6 flex justify-end">
            <button type="submit" className="bg-primary hover:bg-primary-dark text-white font-semibold py-2 px-4 rounded-lg transition-colors">
                Save Changes
            </button>
       </div>
    </form>
  );
};

export default ProfilePage;