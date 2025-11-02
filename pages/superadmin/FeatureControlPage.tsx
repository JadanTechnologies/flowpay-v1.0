
import React, { useState, useEffect } from 'react';
import { ToggleRight, Save } from 'lucide-react';
import { useAppContext } from '../../contexts/AppContext';
import { ModuleId } from '../../types';
import ToggleSwitch from '../../components/ui/ToggleSwitch';

const allModules: { id: ModuleId, name: string, description: string }[] = [
    { id: 'pos', name: 'Point of Sale (POS)', description: 'Module for handling sales, payments, returns, and cart management.' },
    { id: 'inventory', name: 'Inventory', description: 'Manage products, purchase orders, stock counts, suppliers, and transfers.' },
    { id: 'logistics', name: 'Logistics & Fleet', description: 'Enables fleet management, consignments, and delivery tracking.' },
    { id: 'branches', name: 'Branch Management', description: 'Allows tenants to create and manage multiple business locations.' },
    { id: 'staff', name: 'Staff Management', description: 'Allows tenants to manage staff accounts and roles within their organization.' },
    { id: 'reports', name: 'Reports & Accounting', description: 'Provides access to sales summaries and detailed financial reports.' },
    { id: 'invoicing', name: 'Invoicing', description: 'Enables creation and management of customer invoices.' },
    { id: 'credit_management', name: 'Credit Management', description: 'Allows tenants to manage sales on credit and customer balances.' },
    { id: 'automations', name: 'Automations', description: 'Enables tenants to set up scheduled jobs like automated reports.' },
    { id: 'activityLog', name: 'Activity Log', description: 'Logs user actions within the tenant account for auditing.' },
];

const FeatureControlPage: React.FC = () => {
    const { settings, setSettings, addNotification } = useAppContext();
    const [flags, setFlags] = useState<Record<string, boolean>>({});

    useEffect(() => {
        if (settings?.featureFlags) {
            setFlags(settings.featureFlags);
        }
    }, [settings]);

    const handleToggle = (moduleId: ModuleId) => {
        setFlags(prev => ({ ...prev, [moduleId]: !prev[moduleId] }));
    };

    const handleSave = () => {
        if (settings) {
            setSettings({ ...settings, featureFlags: flags as any });
            addNotification({ message: 'Feature flags updated successfully.', type: 'success' });
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <ToggleRight size={32} />
                    <div>
                        <h1 className="text-3xl font-bold text-text-primary">Feature Control</h1>
                        <p className="text-text-secondary">Globally enable or disable modules for all tenants.</p>
                    </div>
                </div>
                <button onClick={handleSave} className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-semibold py-2 px-6 rounded-lg transition-colors">
                    <Save size={16} /> Save Changes
                </button>
            </div>

            <div className="bg-surface border border-border rounded-xl shadow-lg">
                <div className="p-6">
                    <p className="text-sm text-text-secondary">
                        These toggles act as master switches for the entire platform. Disabling a feature here will make it unavailable to all tenants, regardless of their subscription plan.
                    </p>
                </div>
                <div className="divide-y divide-border">
                    {allModules.map(module => (
                        <div key={module.id} className="p-6 flex justify-between items-center hover:bg-background">
                            <div>
                                <h3 className="font-bold text-text-primary">{module.name}</h3>
                                <p className="text-sm text-text-secondary max-w-2xl">{module.description}</p>
                            </div>
                            <ToggleSwitch
                                checked={flags[module.id] ?? false}
                                onChange={() => handleToggle(module.id)}
                            />
                        </div>
                    ))}
                </div>
                 <div className="p-4 bg-background rounded-b-xl flex justify-end">
                    <button onClick={handleSave} className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-semibold py-2 px-6 rounded-lg transition-colors">
                        <Save size={16} /> Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FeatureControlPage;