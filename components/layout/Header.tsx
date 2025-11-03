
import React, { useState } from 'react';
import { Search, Bell, ChevronDown, User, Settings, Calculator as CalculatorIcon, Store, CheckCircle, AlertTriangle, XCircle, Handshake, CreditCard } from 'lucide-react';
// FIX: The `react-router-dom` module seems to have CJS/ESM interop issues in this environment. Using a namespace import as a workaround.
import { Link } from 'react-router-dom';
import { useAppContext } from '../../contexts/AppContext';
import DigitalClock from '../ui/DigitalClock';
import Calculator from '../ui/Calculator';
import NetworkStatusIndicator from '../ui/NetworkStatusIndicator';
import { Notification } from '../../types';

const NotificationIcon: React.FC<{type: Notification['type']}> = ({ type }) => {
    switch(type) {
        case 'success': return <CheckCircle className="text-green-500" />;
        case 'warning': return <AlertTriangle className="text-yellow-500" />;
        case 'error': return <XCircle className="text-red-500" />;
        default: return <Bell className="text-blue-500" />;
    }
}

const Header: React.FC = () => {
  const { 
      session, 
      branches, 
      currentBranchId, 
      setCurrentBranchId,
      notificationHistory,
      hasUnreadNotifications,
      markNotificationsAsRead
  } = useAppContext();
  const [showCalculator, setShowCalculator] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const isCashier = session?.user?.role === 'Cashier';

  const handleBellClick = () => {
    setShowNotifications(prev => !prev);
    if (!showNotifications) { // When opening
        markNotificationsAsRead();
    }
  }

  const currentBranch = branches.find(b => b.id === currentBranchId);
  const userName = session?.user?.name || session?.user?.email;
  const userRole = session?.user?.role?.replace(/_/g, ' ') || 'User';

  return (
    <>
      <header className="bg-surface border-b border-border p-4 flex items-center justify-between">
        {/* Search Bar and Clock */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" size={20} />
            <input
              type="text"
              placeholder="Search transactions, products..."
              className="bg-background border border-border rounded-lg pl-10 pr-4 py-2 w-64 md:w-96 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="hidden lg:block">
            <DigitalClock />
          </div>
        </div>


        {/* Right side icons and profile */}
        <div className="flex items-center gap-4">
            <div className="group relative">
                <button 
                  className={`flex items-center gap-2 bg-background p-2 rounded-lg border border-border ${isCashier ? 'cursor-not-allowed opacity-70' : 'group-hover:bg-border/50'}`}
                  disabled={isCashier}
                >
                    <Store size={18} className="text-primary" />
                    <span className="font-semibold text-sm text-text-primary">{currentBranch?.name || 'Select Branch'}</span>
                    {!isCashier && <ChevronDown size={16} className="text-text-secondary group-hover:rotate-180 transition-transform" />}
                </button>
                {!isCashier && (
                   <div className="absolute right-0 mt-2 w-48 bg-surface border border-border rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity invisible group-hover:visible z-10">
                      {branches.map(branch => (
                           <button 
                              key={branch.id} 
                              onClick={() => setCurrentBranchId(branch.id)}
                              className={`w-full text-left px-4 py-2 text-sm ${currentBranchId === branch.id ? 'text-primary' : 'text-text-secondary'} hover:bg-background`}
                          >
                              {branch.name}
                          </button>
                      ))}
                   </div>
                )}
            </div>
            
          <button
            onClick={() => setShowCalculator(true)}
            className="text-text-secondary hover:text-text-primary"
            title="Open Calculator"
          >
            <CalculatorIcon size={22} />
          </button>
          <div className="relative">
            <button onClick={handleBellClick} className="relative text-text-secondary hover:text-text-primary">
                <Bell size={22} />
                {hasUnreadNotifications && (
                    <span className="absolute -top-1 -right-1 flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                    </span>
                )}
            </button>
            {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-surface border border-border rounded-md shadow-lg z-20">
                    <div className="p-3 font-semibold border-b border-border text-text-primary">Notifications</div>
                    <div className="max-h-96 overflow-y-auto">
                        {notificationHistory.length === 0 ? (
                            <p className="p-4 text-sm text-text-secondary text-center">No notifications yet.</p>
                        ) : (
                            notificationHistory.map(notif => (
                                <div key={notif.id} className="p-3 border-b border-border last:border-b-0 hover:bg-background flex gap-3">
                                    <div className="pt-1">
                                        <NotificationIcon type={notif.type} />
                                    </div>
                                    <div>
                                        <p className="text-sm text-text-primary">{notif.message}</p>
                                        <p className="text-xs text-text-secondary mt-1">{new Date(parseInt(notif.id.split('_')[1])).toLocaleString()}</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
          </div>

          <NetworkStatusIndicator />

          <div className="w-px h-6 bg-border"></div>

          <div className="group relative">
              <button className="flex items-center gap-2">
                  <img src="https://picsum.photos/seed/user/100/100" alt="avatar" className="w-9 h-9 rounded-full" />
                  <div>
                      <p className="font-semibold text-sm text-text-primary text-left">{userName}</p>
                      <p className="text-xs text-text-secondary text-left capitalize">{userRole}</p>
                  </div>
                  <ChevronDown size={16} className="text-text-secondary group-hover:rotate-180 transition-transform" />
              </button>
              <div className="absolute right-0 mt-2 w-48 bg-surface border border-border rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity invisible group-hover:visible z-10">
                  <Link to="/app/settings/profile" className="flex items-center gap-2 px-4 py-2 text-sm text-text-secondary hover:bg-background hover:text-text-primary">
                      <User size={16} /> Profile
                  </Link>
                  <Link to="/app/settings" className="flex items-center gap-2 px-4 py-2 text-sm text-text-secondary hover:bg-background hover:text-text-primary">
                      <Settings size={16} /> Settings
                  </Link>
              </div>
          </div>
        </div>
      </header>
      {showCalculator && <Calculator onClose={() => setShowCalculator(false)} />}
    </>
  );
};

export default Header;
