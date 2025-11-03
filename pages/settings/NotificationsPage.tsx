import React from 'react';
import ToggleSwitch from '../../components/ui/ToggleSwitch';
import { useAppContext } from '../../contexts/AppContext';
import { NotificationPrefs } from '../../contexts/AppContext';

const NotificationsPage: React.FC = () => {
    const { notificationPrefs, setNotificationPrefs } = useAppContext();
    
    const handleToggle = (key: keyof NotificationPrefs) => {
        setNotificationPrefs(prev => ({...prev, [key]: !prev[key]}));
    };
    
    const handleSave = () => {
        // In a real app, this would be an API call
        alert('Notification preferences saved!');
    }

  return (
    <div className="space-y-8">
        <div>
            <h2 className="text-2xl font-bold text-text-primary">Notification Settings</h2>
            <p className="text-text-secondary mt-1">Manage how you receive notifications.</p>
        </div>

        <div className="space-y-6 divide-y divide-border">
            {/* Sales Notifications */}
            <div className="pt-6">
                <h3 className="text-lg font-semibold text-text-primary">Sales Notifications</h3>
                <div className="mt-4 space-y-4">
                    <div className="flex justify-between items-center bg-background p-4 rounded-lg border border-border">
                        <div>
                            <p className="font-medium text-text-primary">Email on new sale</p>
                            <p className="text-sm text-text-secondary">Receive an email for every transaction.</p>
                        </div>
                        <ToggleSwitch checked={notificationPrefs.salesEmail} onChange={() => handleToggle('salesEmail')} />
                    </div>
                     <div className="flex justify-between items-center bg-background p-4 rounded-lg border border-border">
                        <div>
                            <p className="font-medium text-text-primary">Push notification for large orders</p>
                            <p className="text-sm text-text-secondary">Get a push notification for sales over $1,000.</p>
                        </div>
                        <ToggleSwitch checked={notificationPrefs.salesPush} onChange={() => handleToggle('salesPush')} />
                    </div>
                </div>
            </div>

             {/* Inventory Alerts */}
            <div className="pt-6">
                <h3 className="text-lg font-semibold text-text-primary">Inventory Alerts</h3>
                 <div className="mt-4 space-y-4">
                    <div className="flex justify-between items-center bg-background p-4 rounded-lg border border-border">
                        <div>
                            <p className="font-medium text-text-primary">Email for low stock items</p>
                            <p className="text-sm text-text-secondary">When an item reaches its low stock threshold.</p>
                        </div>
                        <ToggleSwitch checked={notificationPrefs.lowStockEmail} onChange={() => handleToggle('lowStockEmail')} />
                    </div>
                     <div className="flex justify-between items-center bg-background p-4 rounded-lg border border-border">
                        <div>
                            <p className="font-medium text-text-primary">SMS for out of stock items</p>
                            <p className="text-sm text-text-secondary">Urgent alert when an item sells out completely.</p>
                        </div>
                        <ToggleSwitch checked={notificationPrefs.lowStockSms} onChange={() => handleToggle('lowStockSms')} />
                    </div>
                </div>
            </div>

            {/* Financial Alerts */}
            <div className="pt-6">
                <h3 className="text-lg font-semibold text-text-primary">Financial Alerts</h3>
                <div className="mt-4 space-y-4">
                    <div className="flex justify-between items-center bg-background p-4 rounded-lg border border-border">
                        <div>
                            <p className="font-medium text-text-primary">Email on refunds</p>
                            <p className="text-sm text-text-secondary">Get notified when a refund is processed.</p>
                        </div>
                        <ToggleSwitch checked={notificationPrefs.refundsEmail} onChange={() => handleToggle('refundsEmail')} />
                    </div>
                    <div className="flex justify-between items-center bg-background p-4 rounded-lg border border-border">
                        <div>
                            <p className="font-medium text-text-primary">Email for payment reminders</p>
                            <p className="text-sm text-text-secondary">Confirm when manual payment reminders are sent.</p>
                        </div>
                        <ToggleSwitch checked={notificationPrefs.creditReminderEmail} onChange={() => handleToggle('creditReminderEmail')} />
                    </div>
                </div>
            </div>
        </div>

        <div className="pt-6 flex justify-end">
            <button onClick={handleSave} className="bg-primary hover:bg-primary-dark text-white font-semibold py-2 px-4 rounded-lg transition-colors">
                Save Preferences
            </button>
       </div>
    </div>
  );
};

export default NotificationsPage;
