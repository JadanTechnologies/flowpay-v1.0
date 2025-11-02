import React, { useState } from 'react';
import { Upload } from 'lucide-react';
import { useAppContext, Language, Currency } from '../../contexts/AppContext';

const ProfilePage: React.FC = () => {
    const { currency, setCurrency, language, setLanguage, addNotification } = useAppContext();
    const [profile, setProfile] = useState({
        fullName: 'Admin User',
        email: 'admin@flowpay.com',
        avatar: 'https://picsum.photos/seed/user/100/100',
    });
    const [company, setCompany] = useState({
        name: 'FlowPay Demo Inc.',
        address: '123 Tech Street, Silicon Valley, CA 94000',
    });

    const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };

    const handleCompanyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCompany({ ...company, [e.target.name]: e.target.value });
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // In a real app, you'd make an API call here.
        addNotification({ message: 'Profile updated successfully!', type: 'success' });
    }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 divide-y divide-border">
      {/* Profile Section */}
      <div>
        <h2 className="text-xl font-bold text-text-primary mb-1">Profile</h2>
        <p className="text-sm text-text-secondary mb-6">This information will be displayed publicly so be careful what you share.</p>
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

      {/* Company Section */}
      <div className="pt-8">
         <h2 className="text-xl font-bold text-text-primary mb-1">Company Information</h2>
        <p className="text-sm text-text-secondary mb-6">Update your company's details.</p>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <label htmlFor="companyName" className="block text-sm font-medium text-text-secondary mb-1">Company Name</label>
                <input type="text" name="name" id="companyName" value={company.name} onChange={handleCompanyChange} className="w-full bg-background border border-border rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary text-sm" />
            </div>
             <div>
                <label htmlFor="companyAddress" className="block text-sm font-medium text-text-secondary mb-1">Address</label>
                <input type="text" name="address" id="companyAddress" value={company.address} onChange={handleCompanyChange} className="w-full bg-background border border-border rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary text-sm" />
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