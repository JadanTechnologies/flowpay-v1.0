import React from 'react';
// FIX: The `react-router-dom` module seems to have CJS/ESM interop issues in this environment. Using a namespace import as a workaround.
import * as ReactRouterDOM from 'react-router-dom';
import { User, CreditCard, Bell, Shield, Puzzle, TabletSmartphone, FileText, ListChecks } from 'lucide-react';

const settingsNav = [
  { name: 'Profile', to: 'profile', icon: User },
  { name: 'Subscription', to: 'subscription-details', icon: ListChecks },
  { name: 'Billing Method', to: 'manage-billing', icon: CreditCard },
  { name: 'Payment History', to: 'payment-history', icon: FileText },
  { name: 'Notifications', to: 'notifications', icon: Bell },
  { name: 'Security', to: 'security', icon: Shield },
  { name: 'Integrations', to: 'integrations', icon: Puzzle },
  { name: 'Access Control', to: 'access-control', icon: TabletSmartphone },
];

const SettingsPage: React.FC = () => {
  const activeLinkClass = 'bg-primary/10 text-primary border-primary';
  const inactiveLinkClass = 'border-transparent hover:bg-surface hover:text-text-primary';

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-text-primary">Settings</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <aside className="md:col-span-1">
          <nav className="space-y-1">
            {settingsNav.map(item => (
              <ReactRouterDOM.NavLink
                key={item.name}
                to={item.to}
                className={({ isActive }) => 
                  `flex items-center gap-3 px-4 py-2 text-sm font-medium rounded-lg border-l-2 transition-colors ${isActive ? activeLinkClass : inactiveLinkClass}`
                }
              >
                <item.icon size={18} />
                <span>{item.name}</span>
              </ReactRouterDOM.NavLink>
            ))}
          </nav>
        </aside>

        <main className="md:col-span-3">
            <div className="bg-surface border border-border rounded-xl p-6 shadow-lg">
                <ReactRouterDOM.Outlet />
            </div>
        </main>
      </div>
    </div>
  );
};

export default SettingsPage;