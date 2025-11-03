import React, { useState } from 'react';
import { useAppContext } from '../../contexts/AppContext';

const ProfilePage: React.FC = () => {
    const { session, addNotification } = useAppContext();
    const [profile, setProfile] = useState({
        // FIX: Access user's name from `user_metadata`
        fullName: session?.user?.user_metadata?.name || '',
        email: session?.user?.email || '',
        avatar: 'https://picsum.photos/seed/superadmin/100/100',
    });
    const [passwordData, setPasswordData] = useState({ current: '', new: '', confirm: '' });

    const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfile(prev => ({ ...prev, avatar: reader.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
    };

    const handleProfileSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // In real app, update session/user object in context and call API
        addNotification({ message: 'Profile updated successfully!', type: 'success' });
    };

    const handlePasswordSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (passwordData.new !== passwordData.confirm) {
            addNotification({ message: 'New passwords do not match.', type: 'error' });
            return;
        }
        if (passwordData.new.length < 6) {
            addNotification({ message: 'New password must be at least 6 characters long.', type: 'warning' });
            return;
        }
        // In real app, call API to change password
        addNotification({ message: 'Password changed successfully!', type: 'success' });
        setPasswordData({ current: '', new: '', confirm: '' });
    };

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-text-primary">Profile Settings</h1>

            <div className="bg-surface border border-border rounded-xl p-6 shadow-lg">
                <form onSubmit={handleProfileSubmit} className="space-y-8 divide-y divide-border">
                    {/* Profile Section */}
                    <div>
                        <h2 className="text-xl font-bold text-text-primary mb-1">Personal Information</h2>
                        <p className="text-sm text-text-secondary mb-6">Update your account's profile information and email address.</p>
                        <div className="flex items-center gap-6">
                            <img src={profile.avatar} alt="Avatar" className="w-20 h-20 rounded-full" />
                            <div className="relative">
                                <button type="button" className="bg-background border border-border rounded-md px-4 py-2 text-sm font-semibold hover:bg-border">Change Avatar</button>
                                <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
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
                         <div className="pt-6 flex justify-end">
                            <button type="submit" className="bg-primary hover:bg-primary-dark text-white font-semibold py-2 px-4 rounded-lg transition-colors">
                                Save Profile
                            </button>
                       </div>
                    </div>
                </form>
            </div>
            
            <div className="bg-surface border border-border rounded-xl p-6 shadow-lg">
                <form onSubmit={handlePasswordSubmit} className="space-y-8">
                    {/* Change Password */}
                    <div>
                        <h3 className="text-xl font-bold text-text-primary mb-1">Change Password</h3>
                        <p className="text-sm text-text-secondary mb-6">Update your password. It's a good idea to use a strong password that you're not using elsewhere.</p>
                        <div className="space-y-4 max-w-lg">
                            <div>
                                <label className="block text-sm font-medium text-text-secondary mb-1">Current Password</label>
                                <input type="password" name="current" value={passwordData.current} onChange={handlePasswordChange} required className="w-full bg-background border border-border rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary text-sm"/>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-text-secondary mb-1">New Password</label>
                                <input type="password" name="new" value={passwordData.new} onChange={handlePasswordChange} required className="w-full bg-background border border-border rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary text-sm"/>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-text-secondary mb-1">Confirm New Password</label>
                                <input type="password" name="confirm" value={passwordData.confirm} onChange={handlePasswordChange} required className="w-full bg-background border border-border rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary text-sm"/>
                            </div>
                        </div>
                        <div className="pt-6 flex justify-end">
                            <button type="submit" className="bg-primary hover:bg-primary-dark text-white font-semibold py-2 px-4 rounded-lg transition-colors">
                                Update Password
                            </button>
                       </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProfilePage;