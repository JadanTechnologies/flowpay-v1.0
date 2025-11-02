import React, { useState } from 'react';
import { TenantSettings, TrackerProvider } from '../../types';
import { tenantSettings as mockSettings } from '../../data/mockData';
import ToggleSwitch from '../../components/ui/ToggleSwitch';
import { Eye, EyeOff, Truck } from 'lucide-react';

const IntegrationsPage: React.FC = () => {
    const [settings, setSettings] = useState<TenantSettings>(mockSettings);
    const [showApiKey, setShowApiKey] = useState(false);

    const handleInputChange = (field: keyof TenantSettings['trackerIntegration'], value: any) => {
        setSettings(prev => ({
            ...prev,
            trackerIntegration: {
                ...prev.trackerIntegration,
                [field]: value,
            },
        }));
    };

    const handleSave = () => {
        // In a real app, you would make an API call here.
        alert('Tracker settings saved successfully!');
        console.log('Saving settings:', settings.trackerIntegration);
    };

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-bold text-text-primary">Integrations</h2>
                <p className="text-text-secondary mt-1">Connect third-party services to FlowPay.</p>
            </div>
            <div className="space-y-6">
                <div className="bg-background p-6 rounded-lg border border-border">
                    <h3 className="font-bold text-text-primary mb-2 flex items-center gap-2">
                        <Truck size={20} />
                        GPS Tracker Integration
                    </h3>
                    <p className="text-sm text-text-secondary mt-1 mb-4">Configure your third-party GPS tracking provider for the Logistics module.</p>

                    <div className="space-y-4">
                        <div>
                            <label className="text-sm text-text-secondary block mb-1">Tracker Provider</label>
                            <select
                                value={settings.trackerIntegration.provider}
                                onChange={e => handleInputChange('provider', e.target.value as TrackerProvider)}
                                className="w-full bg-surface border border-border rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary text-sm"
                            >
                                <option value="teltonika">Teltonika</option>
                                <option value="ruptela">Ruptela</option>
                                <option value="queclink">Queclink</option>
                                <option value="calamp">CalAmp</option>
                                <option value="meitrack">Meitrack</option>
                                <option value="manual">Manual / Other</option>
                            </select>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm text-text-secondary block mb-1">API URL</label>
                                <input
                                    type="text"
                                    value={settings.trackerIntegration.apiUrl}
                                    onChange={e => handleInputChange('apiUrl', e.target.value)}
                                    className="w-full bg-surface border border-border rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary text-sm"
                                />
                            </div>
                            <div>
                                <label className="text-sm text-text-secondary block mb-1">API Key</label>
                                <div className="relative">
                                    <input
                                        type={showApiKey ? 'text' : 'password'}
                                        value={settings.trackerIntegration.apiKey}
                                        onChange={e => handleInputChange('apiKey', e.target.value)}
                                        className="w-full bg-surface border border-border rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary text-sm pr-10"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowApiKey(!showApiKey)}
                                        className="absolute inset-y-0 right-0 px-3 flex items-center text-text-secondary"
                                    >
                                        {showApiKey ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-background p-4 rounded-lg border border-border">
                    <div className="flex justify-between items-center">
                        <div>
                            <h3 className="font-bold text-text-primary">Enable Weight Sensors</h3>
                            <p className="text-sm text-text-secondary mt-1">Allow reading weight data from compatible trackers to monitor cargo loads.</p>
                        </div>
                        <ToggleSwitch
                            checked={settings.trackerIntegration.enableWeightSensors}
                            onChange={(val) => handleInputChange('enableWeightSensors', val)}
                        />
                    </div>
                </div>
            </div>
             <div className="pt-6 flex justify-end">
                <button onClick={handleSave} className="bg-primary hover:bg-primary-dark text-white font-semibold py-2 px-4 rounded-lg transition-colors">
                    Save Changes
                </button>
            </div>
        </div>
    );
};

export default IntegrationsPage;
