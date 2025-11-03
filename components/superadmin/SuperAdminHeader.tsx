






import React, { useMemo } from 'react';
import { Search, Bell, ChevronDown, LogOut, Settings, Power, User } from 'lucide-react';
// FIX: The `react-router-dom` module seems to have CJS/ESM interop issues in this environment. Using a namespace import as a workaround.
import * as ReactRouterDOM from 'react-router-dom';
import { useAppContext } from '../../contexts/AppContext';
import NetworkStatusIndicator from '../ui/NetworkStatusIndicator';

const SuperAdminHeader: React.FC = () => {
  const { settings, setSettings, logout, session } = useAppContext();
  const navigate = ReactRouterDOM.useNavigate();

  const isMaintenanceMode = settings?.isMaintenanceMode ?? false;

  const handleShutdownToggle = () => {
    if (!settings) return;
    
    if (isMaintenanceMode) {
      setSettings({ ...settings, isMaintenanceMode: false });
      alert('System is back online.');
    } else {
      const confirm = window.confirm('Are you sure you want to enable maintenance mode? All non-admin users will be locked out.');
      if (confirm) {
        setSettings({ ...settings, isMaintenanceMode: true });
      }
    }
  };

  const handleSignOut = async () => {
    await logout();
    navigate('/admin/login');
  };

  // FIX: Access user's name from `user_metadata`
  const userName = useMemo(() => session?.user?.user_metadata?.name || 'Super Admin', [session]);
  const userRole = useMemo(() => "Platform Owner", []);


  return (
    <header className="bg-surface border-b border-border p-4 flex items-center justify-between">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" size={20} />
        <input
          type="text"
          placeholder="Search tenants, subscriptions..."
          className="bg-background border border-border rounded-lg pl-10 pr-4 py-2 w-64 md:w-96 focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {/* Right side icons and profile */}
      <div className="flex items-center gap-4">
        <button className="relative text-text-secondary hover:text-text-primary">
          <Bell size={22} />
        </button>
        
        <button 
          onClick={handleShutdownToggle}
          className={`hover:opacity-80 ${isMaintenanceMode ? "text-green-500" : "text-red-500"}`}
          title={isMaintenanceMode ? "Bring System Online" : "System Shutdown"}
        >
            <Power size={22} />
        </button>
        
        <NetworkStatusIndicator />

        <div className="w-px h-6 bg-border"></div>

        <div className="group relative">
            <button className="flex items-center gap-2">
                <img src="https://picsum.photos/seed/superadmin/100/100" alt="avatar" className="w-9 h-9 rounded-full" />
                <div>
                    <p className="font-semibold text-sm text-text-primary text-left">{userName}</p>
                    <p className="text-xs text-text-secondary text-left">{userRole}</p>
                </div>
                <ChevronDown size={16} className="text-text-secondary group-hover:rotate-180 transition-transform" />
            </button>
            <div className="absolute right-0 mt-2 w-48 bg-surface border border-border rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity invisible group-hover:visible z-10">
                <ReactRouterDOM.Link to="/admin/profile" className="flex items-center gap-2 px-4 py-2 text-sm text-text-secondary hover:bg-background hover:text-text-primary">
                    <User size={16} /> Profile
                </ReactRouterDOM.Link>
                <ReactRouterDOM.Link to="/admin/system-settings" className="flex items-center gap-2 px-4 py-2 text-sm text-text-secondary hover:bg-background hover:text-text-primary">
                    <Settings size={16} /> System Settings
                </ReactRouterDOM.Link>
                <hr className="border-border"/>
                <button onClick={handleSignOut} className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-background">
                    <LogOut size={16} /> Sign Out
                </button>
            </div>
        </div>
      </div>
    </header>
  );
};

export default SuperAdminHeader;