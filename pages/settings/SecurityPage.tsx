import React, { useState } from 'react';
import ToggleSwitch from '../../components/ui/ToggleSwitch';
import { Shield, Smartphone, Monitor, LogOut } from 'lucide-react';

const initialSessions = [
    { id: 1, device: 'Chrome on macOS', location: 'San Francisco, CA', lastActive: 'Current session', isCurrent: true },
    { id: 2, device: 'FlowPay iOS App', location: 'Los Angeles, CA', lastActive: '2 days ago', isCurrent: false },
];

const SecurityPage: React.FC = () => {
    const [passwordData, setPasswordData] = useState({ current: '', new: '', confirm: '' });
    const [is2faEnabled, setIs2faEnabled] = useState(false);
    const [sessions, setSessions] = useState(initialSessions);
    
    const handlePasswordChange = (e: React.FormEvent) => {
        e.preventDefault();
        if (passwordData.new !== passwordData.confirm) {
            alert("New passwords do not match.");
            return;
        }
        alert("Password changed successfully!");
        setPasswordData({ current: '', new: '', confirm: '' });
    }
    
    const handleRevokeSession = (id: number) => {
        if (window.confirm('Are you sure you want to log out this session?')) {
            setSessions(sessions.filter(s => s.id !== id));
        }
    }

  return (
    <div className="space-y-8 divide-y divide-border">
      <div>
        <h2 className="text-2xl font-bold text-text-primary mb-4">Security Settings</h2>
        <p className="text-text-secondary">
          Manage your password, two-factor authentication, and review your active sessions.
        </p>
      </div>
      
      {/* Change Password */}
      <div className="pt-8">
        <h3 className="text-lg font-semibold text-text-primary mb-4">Change Password</h3>
        <form onSubmit={handlePasswordChange} className="space-y-4 max-w-lg">
            <div>
                 <label className="block text-sm font-medium text-text-secondary mb-1">Current Password</label>
                 <input type="password" value={passwordData.current} onChange={e => setPasswordData({...passwordData, current: e.target.value})} required className="w-full bg-background border border-border rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary text-sm"/>
            </div>
             <div>
                 <label className="block text-sm font-medium text-text-secondary mb-1">New Password</label>
                 <input type="password" value={passwordData.new} onChange={e => setPasswordData({...passwordData, new: e.target.value})} required className="w-full bg-background border border-border rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary text-sm"/>
            </div>
             <div>
                 <label className="block text-sm font-medium text-text-secondary mb-1">Confirm New Password</label>
                 <input type="password" value={passwordData.confirm} onChange={e => setPasswordData({...passwordData, confirm: e.target.value})} required className="w-full bg-background border border-border rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary text-sm"/>
            </div>
            <div>
                <button type="submit" className="bg-primary hover:bg-primary-dark text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm">Update Password</button>
            </div>
        </form>
      </div>

      {/* 2FA */}
      <div className="pt-8">
         <h3 className="text-lg font-semibold text-text-primary mb-4">Two-Factor Authentication (2FA)</h3>
         <div className="flex justify-between items-center bg-background p-4 rounded-lg border border-border">
            <div>
                <p className="font-medium text-text-primary">Enable 2FA</p>
                <p className="text-sm text-text-secondary">Add an extra layer of security to your account.</p>
            </div>
            <ToggleSwitch checked={is2faEnabled} onChange={setIs2faEnabled} />
        </div>
        {is2faEnabled && (
            <div className="mt-4 p-4 border border-dashed border-border rounded-lg text-center">
                <p className="text-text-secondary">2FA Setup instructions and QR code would appear here in a real application.</p>
            </div>
        )}
      </div>

       {/* Active Sessions */}
      <div className="pt-8">
         <h3 className="text-lg font-semibold text-text-primary mb-4">Active Sessions</h3>
         <div className="space-y-3">
            {sessions.map(session => (
                <div key={session.id} className="flex justify-between items-center bg-background p-4 rounded-lg border border-border">
                    <div className="flex items-center gap-4">
                        {session.device.includes('iOS') ? <Smartphone className="text-text-secondary" /> : <Monitor className="text-text-secondary" />}
                        <div>
                            <p className="font-semibold text-text-primary">{session.device}</p>
                            <p className="text-sm text-text-secondary">{session.location} - <span className={session.isCurrent ? 'text-green-400' : ''}>{session.lastActive}</span></p>
                        </div>
                    </div>
                    {!session.isCurrent && (
                        <button onClick={() => handleRevokeSession(session.id)} className="flex items-center gap-2 text-sm text-red-400 hover:bg-red-900/50 p-2 rounded-lg">
                            <LogOut size={14}/> Log out
                        </button>
                    )}
                </div>
            ))}
         </div>
      </div>

    </div>
  );
};

export default SecurityPage;