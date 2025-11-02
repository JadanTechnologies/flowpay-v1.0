import React, { useState, useContext, useEffect } from 'react';
import { Settings, Server, Mail, Smartphone, CreditCard, Copy, Eye, EyeOff, FileText, Palette, Loader, Trash2, Globe, PlusCircle, Database, Edit } from 'lucide-react';
import { SystemSettings, PaymentGatewayId, PaymentGateway, BrandingSettings } from '../../types';
import Tabs from '../../components/ui/Tabs';
import ToggleSwitch from '../../components/ui/ToggleSwitch';
import { useAppContext } from '../../contexts/AppContext';

const SystemSettingsPage: React.FC = () => {
    const { settings: contextSettings, setSettings: setContextSettings } = useAppContext();
    const [localSettings, setLocalSettings] = useState<SystemSettings | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState('general');
    const [showPass, setShowPass] = useState(false);

    useEffect(() => {
        if (contextSettings) {
            setLocalSettings(JSON.parse(JSON.stringify(contextSettings))); // Deep copy for local editing
            setLoading(false);
        } else {
             setError('Failed to load system settings from context.');
             setLoading(false);
        }
    }, [contextSettings]);

    const handleSaveSettings = async () => {
        if (!localSettings) return;
        
        // Update context with local changes
        setContextSettings(localSettings);
        alert('Settings saved successfully!');
    };

    const handleGatewayChange = (id: PaymentGatewayId, field: keyof PaymentGateway, value: string | boolean) => {
        if (!localSettings) return;
        setLocalSettings(prev => ({
            ...prev!,
            paymentGateways: prev!.paymentGateways.map(gw => 
                gw.id === id ? { ...gw, [field]: value } : gw
            )
        }));
    };
    
    const handleInputChange = (section: keyof SystemSettings | 'topLevel', field: any, value: any) => {
        if (!localSettings) return;
        setLocalSettings(prev => {
            if (section === 'topLevel') {
                return {...prev!, [field]: value};
            }
            const currentSection = prev![section as keyof SystemSettings];
            if (typeof currentSection === 'object' && currentSection !== null && !Array.isArray(currentSection)) {
                return { ...prev!, [section]: { ...(currentSection as object), [field]: value } };
            }
            return { ...prev!, [section as keyof SystemSettings]: value };
        });
    };
    
    const handleBrandingFeatureChange = (index: number, field: keyof BrandingSettings['features'][0], value: string) => {
        if (!localSettings) return;
        const newFeatures = [...localSettings.branding.features];
        newFeatures[index] = { ...newFeatures[index], [field]: value };
        handleInputChange('branding', 'features', newFeatures);
    };

    const handleAddBrandingFeature = () => {
        if (!localSettings) return;
        const newFeature = { icon: 'Zap', title: 'New Feature', description: 'Describe the new feature.' };
        handleInputChange('branding', 'features', [...localSettings.branding.features, newFeature]);
    };
    
    const handleRemoveBrandingFeature = (index: number) => {
        if (!localSettings) return;
        const newFeatures = localSettings.branding.features.filter((_, i) => i !== index);
        handleInputChange('branding', 'features', newFeatures);
    };

    const handleHeroStatChange = (index: number, field: 'value' | 'label', value: string) => {
        if (!localSettings) return;
        const newStats = [...localSettings.branding.heroStats];
        newStats[index] = { ...newStats[index], [field]: value };
        handleInputChange('branding', 'heroStats', newStats);
    };

    const handleAddHeroStat = () => {
        if (!localSettings) return;
        const newStat = { value: '1M+', label: 'New Stat' };
        handleInputChange('branding', 'heroStats', [...localSettings.branding.heroStats, newStat]);
    };

    const handleRemoveHeroStat = (index: number) => {
        if (!localSettings) return;
        const newStats = localSettings.branding.heroStats.filter((_, i) => i !== index);
        handleInputChange('branding', 'heroStats', newStats);
    };

    const tabs = [
        { id: 'general', label: 'General', icon: <Settings size={16} /> },
        { id: 'branding', label: 'Branding', icon: <Palette size={16} /> },
        { id: 'content', label: 'Content', icon: <FileText size={16} /> },
        { id: 'email', label: 'Email', icon: <Mail size={16} /> },
        { id: 'gateways', label: 'Payment Gateways', icon: <CreditCard size={16} /> },
        { id: 'notifications', label: 'Notifications', icon: <Smartphone size={16} /> },
        { id: 'services', label: 'Services', icon: <Server size={16} /> },
    ];
    
    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text).then(() => alert('Copied to clipboard!'));
    };
    
    const renderContent = () => {
        if (loading) {
            return <div className="flex justify-center items-center h-64"><Loader className="animate-spin text-primary" size={40}/></div>;
        }
        if (error || !localSettings) {
            return <div className="flex justify-center items-center h-64 text-red-400">{error || 'Could not load settings.'}</div>;
        }

        switch (activeTab) {
            case 'general':
                return (
                    <div className="space-y-6">
                        <div className="bg-background p-4 rounded-lg border border-border">
                            <div className="flex justify-between items-center">
                                <h3 className="font-bold text-text-primary">Maintenance Mode</h3>
                                <ToggleSwitch checked={localSettings.isMaintenanceMode} onChange={(val) => handleInputChange('topLevel', 'isMaintenanceMode', val)} />
                            </div>
                            <p className="text-sm text-text-secondary mt-1">When enabled, only Super Admins can access the platform. A maintenance page will be shown to all other users.</p>
                            {localSettings.isMaintenanceMode && (
                                <div className="mt-4">
                                     <label className="text-sm text-text-secondary block mb-1">Custom Message</label>
                                     <textarea value={localSettings.maintenanceMessage} onChange={e => handleInputChange('topLevel', 'maintenanceMessage', e.target.value)} rows={3} className="w-full bg-surface border border-border rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary text-sm" />
                                </div>
                            )}
                        </div>
                         <div className="bg-background p-4 rounded-lg border border-border">
                            <h3 className="font-bold text-text-primary">Inactivity Logout</h3>
                            <p className="text-sm text-text-secondary mt-1">Automatically log out tenants after a period of inactivity.</p>
                            <div className="mt-4">
                                <label className="text-sm text-text-secondary block mb-1">Timeout (minutes)</label>
                                <input type="number" value={localSettings.inactivityLogoutTimer} onChange={e => handleInputChange('topLevel', 'inactivityLogoutTimer', parseInt(e.target.value))} className="w-full md:w-1/3 bg-surface border border-border rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary text-sm" />
                            </div>
                        </div>
                    </div>
                );
            case 'branding':
                return (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm text-text-secondary block mb-1">Platform Name</label>
                                <input type="text" value={localSettings.branding.platformName} onChange={e => handleInputChange('branding', 'platformName', e.target.value)} className="w-full bg-background border border-border rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary text-sm" />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm text-text-secondary block mb-1">Logo URL</label>
                                <input type="text" value={localSettings.branding.logoUrl} onChange={e => handleInputChange('branding', 'logoUrl', e.target.value)} className="w-full bg-background border border-border rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary text-sm" />
                            </div>
                             <div>
                                <label className="text-sm text-text-secondary block mb-1">Favicon URL</label>
                                <input type="text" value={localSettings.branding.faviconUrl} onChange={e => handleInputChange('branding', 'faviconUrl', e.target.value)} className="w-full bg-background border border-border rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary text-sm" />
                            </div>
                        </div>
                        <h3 className="font-bold text-text-primary pt-4 border-t border-border">Landing Page: Hero Section</h3>
                         <div>
                            <label className="text-sm text-text-secondary block mb-1">Hero Title (HTML supported)</label>
                            <input type="text" value={localSettings.branding.heroTitle} onChange={e => handleInputChange('branding', 'heroTitle', e.target.value)} className="w-full bg-background border border-border rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary text-sm" />
                        </div>
                         <div>
                            <label className="text-sm text-text-secondary block mb-1">Hero Subtitle</label>
                            <textarea value={localSettings.branding.heroSubtitle} onChange={e => handleInputChange('branding', 'heroSubtitle', e.target.value)} rows={2} className="w-full bg-background border border-border rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary text-sm" />
                        </div>
                        
                        <div>
                            <label className="text-sm text-text-secondary block mb-2">Hero Stats</label>
                            <div className="space-y-2">
                                {localSettings.branding.heroStats.map((stat, index) => (
                                    <div key={index} className="flex items-center gap-2">
                                        <input type="text" placeholder="Value (e.g., 10k+)" value={stat.value} onChange={e => handleHeroStatChange(index, 'value', e.target.value)} className="w-1/3 bg-surface border border-border rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary text-sm" />
                                        <input type="text" placeholder="Label (e.g., Active Users)" value={stat.label} onChange={e => handleHeroStatChange(index, 'label', e.target.value)} className="w-2/3 bg-surface border border-border rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary text-sm" />
                                        <button type="button" onClick={() => handleRemoveHeroStat(index)} className="p-2 text-red-400 hover:bg-red-900/50 rounded-md"><Trash2 size={16}/></button>
                                    </div>
                                ))}
                            </div>
                            <button type="button" onClick={handleAddHeroStat} className="mt-2 flex items-center gap-1 text-sm text-primary hover:underline">
                                <PlusCircle size={14}/> Add Stat
                            </button>
                        </div>

                         <h3 className="font-bold text-text-primary pt-4 border-t border-border">Landing Page: Features Section</h3>
                         <div className="space-y-3">
                            {localSettings.branding.features.map((feature, index) => (
                                <div key={index} className="bg-background p-3 rounded-lg border border-border grid grid-cols-1 md:grid-cols-3 gap-3">
                                    <input type="text" placeholder="Icon Name (e.g., ShoppingCart)" value={feature.icon} onChange={e => handleBrandingFeatureChange(index, 'icon', e.target.value)} className="w-full bg-surface border border-border rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary text-sm"/>
                                    <input type="text" placeholder="Title" value={feature.title} onChange={e => handleBrandingFeatureChange(index, 'title', e.target.value)} className="w-full bg-surface border border-border rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary text-sm"/>
                                    <div className="flex items-center gap-2">
                                        <input type="text" placeholder="Description" value={feature.description} onChange={e => handleBrandingFeatureChange(index, 'description', e.target.value)} className="w-full bg-surface border border-border rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary text-sm"/>
                                        <button onClick={() => handleRemoveBrandingFeature(index)} className="p-2 text-red-400 hover:bg-red-900/50 rounded-md"><Trash2 size={16}/></button>
                                    </div>
                                </div>
                            ))}
                         </div>
                         <button onClick={handleAddBrandingFeature} className="text-sm text-primary hover:underline">+ Add Feature</button>

                    </div>
                );
            case 'content':
                return (
                     <div className="space-y-4">
                        <div>
                            <label className="text-sm text-text-secondary block mb-1">Footer Credits</label>
                            <input type="text" value={localSettings.footerCredits} onChange={e => handleInputChange('topLevel', 'footerCredits', e.target.value)} className="w-full bg-background border border-border rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary text-sm" />
                        </div>
                        <div>
                            <label className="text-sm text-text-secondary block mb-1">Terms of Service URL</label>
                            <input type="text" value={localSettings.termsUrl} onChange={e => handleInputChange('topLevel', 'termsUrl', e.target.value)} className="w-full bg-background border border-border rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary text-sm" />
                        </div>
                         <div>
                            <label className="text-sm text-text-secondary block mb-1">Privacy Policy URL</label>
                            <input type="text" value={localSettings.privacyUrl} onChange={e => handleInputChange('topLevel', 'privacyUrl', e.target.value)} className="w-full bg-background border border-border rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary text-sm" />
                        </div>
                         <div>
                            <label className="text-sm text-text-secondary block mb-1">Refund Policy URL</label>
                            <input type="text" value={localSettings.refundUrl} onChange={e => handleInputChange('topLevel', 'refundUrl', e.target.value)} className="w-full bg-background border border-border rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary text-sm" />
                        </div>
                    </div>
                )
            case 'email':
                 return (
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm text-text-secondary block mb-1">Email Provider</label>
                            <select value={localSettings.email.provider} onChange={e => handleInputChange('email', 'provider', e.target.value as 'smtp' | 'resend')} className="w-full bg-background border border-border rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary text-sm">
                                <option value="smtp">Standard SMTP</option>
                                <option value="resend">Resend</option>
                            </select>
                        </div>

                        {localSettings.email.provider === 'resend' && (
                             <div className="bg-background p-4 rounded-lg border border-border">
                                <h3 className="font-bold text-text-primary mb-2">Resend Configuration</h3>
                                <div>
                                    <label className="text-sm text-text-secondary block mb-1">Resend API Key</label>
                                    <input type="password" value={localSettings.email.apiKey || ''} onChange={e => handleInputChange('email', 'apiKey', e.target.value)} className="w-full bg-surface border border-border rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary text-sm" />
                                </div>
                            </div>
                        )}

                        {localSettings.email.provider === 'smtp' && (
                             <div className="bg-background p-4 rounded-lg border border-border space-y-4">
                                <h3 className="font-bold text-text-primary">SMTP Configuration</h3>
                                <div>
                                    <label className="text-sm text-text-secondary block mb-1">SMTP Host</label>
                                    <input type="text" value={localSettings.email.host || ''} onChange={e => handleInputChange('email', 'host', e.target.value)} className="w-full bg-surface border border-border rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary text-sm" />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="text-sm text-text-secondary block mb-1">SMTP Port</label>
                                        <input type="number" value={localSettings.email.port || ''} onChange={e => handleInputChange('email', 'port', parseInt(e.target.value))} className="w-full bg-surface border border-border rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary text-sm" />
                                    </div>
                                    <div>
                                        <label className="text-sm text-text-secondary block mb-1">Username</label>
                                        <input type="text" value={localSettings.email.user || ''} onChange={e => handleInputChange('email', 'user', e.target.value)} className="w-full bg-surface border border-border rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary text-sm" />
                                    </div>
                                    <div>
                                        <label className="text-sm text-text-secondary block mb-1">Password</label>
                                        <div className="relative">
                                            <input type={showPass ? 'text' : 'password'} value={localSettings.email.pass || ''} onChange={e => handleInputChange('email', 'pass', e.target.value)} className="w-full bg-surface border border-border rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary text-sm" />
                                            <button onClick={() => setShowPass(!showPass)} className="absolute right-2 top-1/2 -translate-y-1/2 text-text-secondary">{showPass ? <EyeOff size={16}/> : <Eye size={16}/>}</button>
                                        </div>
                                    </div>
                                </div>
                             </div>
                        )}
                    </div>
                );
            case 'gateways':
                return (
                    <div className="space-y-6">
                        {localSettings.paymentGateways.map((gateway) => (
                            <div key={gateway.id} className="bg-background p-4 rounded-lg border border-border">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-bold text-text-primary">{gateway.name}</h3>
                                    <ToggleSwitch checked={gateway.enabled} onChange={(val) => handleGatewayChange(gateway.id, 'enabled', val)} />
                                </div>
                                {gateway.enabled && (
                                    <div className="space-y-4">
                                        {gateway.id === 'manual' ? (
                                            <div>
                                                <label className="text-sm text-text-secondary block mb-1">Payment Instructions</label>
                                                <textarea
                                                    value={gateway.apiKey}
                                                    onChange={e => handleGatewayChange(gateway.id, 'apiKey', e.target.value)}
                                                    rows={4}
                                                    className="w-full bg-surface border border-border rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary text-sm font-mono"
                                                    placeholder="Enter bank details or other manual payment instructions here."
                                                />
                                                <p className="text-xs text-text-secondary mt-1">These instructions will be shown to tenants who choose this payment method.</p>
                                            </div>
                                        ) : (
                                            <>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="text-sm text-text-secondary block mb-1">{gateway.id === 'paypal' ? 'Client ID' : 'API Key / Public Key'}</label>
                                                        <input type="text" value={gateway.apiKey} onChange={e => handleGatewayChange(gateway.id, 'apiKey', e.target.value)} className="w-full bg-surface border border-border rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary text-sm" />
                                                    </div>
                                                    <div>
                                                        <label className="text-sm text-text-secondary block mb-1">{gateway.id === 'paypal' ? 'Client Secret' : 'Secret Key'}</label>
                                                        <input type="password" value={gateway.secretKey} onChange={e => handleGatewayChange(gateway.id, 'secretKey', e.target.value)} className="w-full bg-surface border border-border rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary text-sm" />
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="text-sm text-text-secondary block mb-1">Webhook URL</label>
                                                    <div className="flex items-center gap-2">
                                                        <input type="text" readOnly value={gateway.webhookUrl} className="w-full bg-surface border border-border rounded-md px-3 py-2 text-sm text-text-secondary" />
                                                        <button onClick={() => copyToClipboard(gateway.webhookUrl)} className="p-2 bg-border rounded-md hover:bg-border/70"><Copy size={16} /></button>
                                                    </div>
                                                    <p className="text-xs text-text-secondary mt-1">Add this URL to your {gateway.name} dashboard to receive payment notifications.</p>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                );
             case 'notifications':
                 return (
                     <div className="space-y-6">
                        <div className="bg-background p-4 rounded-lg border border-border">
                            <h3 className="font-bold text-text-primary mb-2">Twilio (SMS)</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm text-text-secondary block mb-1">Account SID</label>
                                    <input type="text" value={localSettings.notifications.twilioSid} onChange={e => handleInputChange('notifications', 'twilioSid', e.target.value)} className="w-full bg-surface border border-border rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary text-sm" />
                                </div>
                                <div>
                                    <label className="text-sm text-text-secondary block mb-1">Auth Token</label>
                                    <input type="password" value={localSettings.notifications.twilioToken} onChange={e => handleInputChange('notifications', 'twilioToken', e.target.value)} className="w-full bg-surface border border-border rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary text-sm" />
                                </div>
                            </div>
                        </div>
                         <div className="bg-background p-4 rounded-lg border border-border">
                            <h3 className="font-bold text-text-primary mb-2">OneSignal (Push Notifications)</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm text-text-secondary block mb-1">App ID</label>
                                    <input type="text" value={localSettings.notifications.oneSignalAppId} onChange={e => handleInputChange('notifications', 'oneSignalAppId', e.target.value)} className="w-full bg-surface border border-border rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary text-sm" />
                                </div>
                                <div>
                                    <label className="text-sm text-text-secondary block mb-1">REST API Key</label>
                                    <input type="password" value={localSettings.notifications.oneSignalApiKey} onChange={e => handleInputChange('notifications', 'oneSignalApiKey', e.target.value)} className="w-full bg-surface border border-border rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary text-sm" />
                                </div>
                            </div>
                        </div>
                        <div className="bg-background p-4 rounded-lg border border-border">
                            <h3 className="font-bold text-text-primary mb-2">Firebase Cloud Messaging (FCM)</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm text-text-secondary block mb-1">Server Key</label>
                                    <input type="password" value={localSettings.notifications.firebaseServerKey} onChange={e => handleInputChange('notifications', 'firebaseServerKey', e.target.value)} className="w-full bg-surface border border-border rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary text-sm" />
                                </div>
                            </div>
                        </div>
                    </div>
                 );
            case 'services':
                return (
                    <div className="space-y-6">
                        <div className="bg-background p-4 rounded-lg border border-border">
                            <h3 className="font-bold text-text-primary mb-2 flex items-center gap-2">
                                <Globe size={20} />
                                IP Geolocation Provider
                            </h3>
                            <p className="text-sm text-text-secondary mt-1 mb-4">Select the provider for IP to location lookups used in tenant access control.</p>
                            
                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm text-text-secondary block mb-1">Provider</label>
                                    <select
                                        value={localSettings.ipGeolocation.provider}
                                        onChange={e => handleInputChange('ipGeolocation', 'provider', e.target.value)}
                                        className="w-full bg-surface border border-border rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary text-sm"
                                    >
                                        <option value="ip-api">ip-api.com (Free, no key required)</option>
                                        <option value="ipinfo">ipinfo.io (API Key required)</option>
                                    </select>
                                </div>
                                {localSettings.ipGeolocation.provider === 'ipinfo' && (
                                    <div>
                                        <label className="text-sm text-text-secondary block mb-1">ipinfo.io API Key</label>
                                        <input
                                            type="password"
                                            value={localSettings.ipGeolocation.apiKey || ''}
                                            onChange={e => handleInputChange('ipGeolocation', 'apiKey', e.target.value)}
                                            className="w-full bg-surface border border-border rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary text-sm"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-text-primary">System Settings</h1>
      
      <div className="bg-surface border border-border rounded-xl shadow-lg">
        <div className="p-6">
            <Tabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>

        <div className="px-6 pb-6">
            {renderContent()}
        </div>
        <div className="p-4 bg-background rounded-b-xl flex justify-end">
            <button onClick={handleSaveSettings} disabled={loading || !localSettings} className="bg-primary hover:bg-primary-dark text-white font-semibold py-2 px-6 rounded-lg transition-colors disabled:bg-primary/50 disabled:cursor-not-allowed">
                Save Changes
            </button>
        </div>
      </div>
    </div>
  );
};

export default SystemSettingsPage;