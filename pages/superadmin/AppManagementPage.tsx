

import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import { MobileAppSettings } from '../../types';
import ToggleSwitch from '../../components/ui/ToggleSwitch';
import { Smartphone, Save, UploadCloud, File as FileIcon, Trash2, Palette } from 'lucide-react';

const AppManagementPage: React.FC = () => {
    const { settings, setSettings, addNotification } = useAppContext();
    const [appSettings, setAppSettings] = useState<MobileAppSettings | null>(settings?.mobileApp || null);
    const [files, setFiles] = useState<{ android: File | null, ios: File | null }>({ android: null, ios: null });

    useEffect(() => {
        if (settings?.mobileApp) {
            setAppSettings(settings.mobileApp);
        }
    }, [settings]);

    if (!appSettings) {
        return <div>Loading app settings...</div>;
    }

    const handleChange = (field: keyof MobileAppSettings, value: string | boolean | number | undefined) => {
        setAppSettings(prev => prev ? { ...prev, [field]: value } : null);
    };

    const handleFileSelect = (platform: 'android' | 'ios', e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFiles(prev => ({ ...prev, [platform]: e.target.files![0] }));
        }
    };

    const handleUseFile = (platform: 'android' | 'ios') => {
        const file = files[platform];
        if (!file || !appSettings) return;

        if (platform === 'android') {
            handleChange('androidFileName', file.name);
            handleChange('androidFileSize', file.size);
            handleChange('androidLastUpdated', new Date().toISOString());
        } else {
            handleChange('iosFileName', file.name);
            handleChange('iosFileSize', file.size);
            handleChange('iosLastUpdated', new Date().toISOString());
        }

        setFiles(prev => ({ ...prev, [platform]: null }));
        addNotification({ message: `${platform.toUpperCase()} app file selected. Click 'Save Changes' to confirm.`, type: 'info' });
    };

    const handleRemoveFile = (platform: 'android' | 'ios') => {
        if (!window.confirm(`Are you sure you want to remove the ${platform.toUpperCase()} app file? This will revert downloads to the store URL.`)) return;
        
        if (platform === 'android') {
            handleChange('androidFileName', undefined);
            handleChange('androidFileSize', undefined);
            handleChange('androidLastUpdated', undefined);
        } else {
            handleChange('iosFileName', undefined);
            handleChange('iosFileSize', undefined);
            handleChange('iosLastUpdated', undefined);
        }
        addNotification({ message: `${platform.toUpperCase()} app file removed. Save changes to confirm.`, type: 'info' });
    }
    
    const handleSave = () => {
        if (settings && appSettings) {
            setSettings({ ...settings, mobileApp: appSettings });
            addNotification({ message: 'App settings saved successfully!', type: 'success' });
        }
    };
    
    const renderFileUpload = (platform: 'android' | 'ios') => {
        const platformName = platform === 'android' ? 'Android' : 'iOS';
        const fileExtension = platform === 'android' ? '.apk' : '.ipa';
        const fileData = {
            name: appSettings?.[`${platform}FileName`],
            size: appSettings?.[`${platform}FileSize`],
            updated: appSettings?.[`${platform}LastUpdated`],
        };
        const selectedFile = files[platform];

        return (
            <div>
                <h4 className="font-semibold text-text-primary mb-2">{platformName} App ({fileExtension})</h4>
                {fileData.name && fileData.size && fileData.updated ? (
                    <div className="bg-surface p-3 rounded-md border border-border">
                        <div className="flex items-center gap-3">
                            <FileIcon className="text-green-400 flex-shrink-0" size={24}/>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-text-primary truncate">{fileData.name}</p>
                                <p className="text-xs text-text-secondary">
                                    {(fileData.size / 1024 / 1024).toFixed(2)} MB | 
                                    Updated: {new Date(fileData.updated).toLocaleDateString()}
                                </p>
                            </div>
                            <button type="button" onClick={() => handleRemoveFile(platform)} className="p-2 text-red-400 hover:bg-red-900/50 rounded-md">
                                <Trash2 size={16}/>
                            </button>
                        </div>
                    </div>
                ) : selectedFile ? (
                    <div className="bg-surface p-3 rounded-md border border-border">
                        <div className="flex items-center gap-3">
                            <FileIcon className="text-blue-400 flex-shrink-0" size={24}/>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-text-primary truncate">{selectedFile.name}</p>
                                <p className="text-xs text-text-secondary">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                            </div>
                            <button type="button" onClick={() => handleUseFile(platform)} className="flex items-center gap-1 text-xs bg-primary/20 text-primary font-semibold py-1 px-2 rounded-lg hover:bg-primary/40">
                                <UploadCloud size={14}/> Use File
                            </button>
                        </div>
                    </div>
                ) : (
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-border border-dashed rounded-lg cursor-pointer bg-surface hover:bg-background">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
                            <UploadCloud className="w-8 h-8 mb-4 text-text-secondary" />
                            <p className="mb-2 text-sm text-text-secondary"><span className="font-semibold">Click to upload</span></p>
                            <p className="text-xs text-text-secondary">{fileExtension.toUpperCase()} file</p>
                        </div>
                        <input type="file" className="hidden" accept={fileExtension} onChange={(e) => handleFileSelect(platform, e)} />
                    </label>
                )}
            </div>
        );
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Smartphone size={32} />
                <div>
                    <h1 className="text-3xl font-bold text-text-primary">App Management</h1>
                    <p className="text-text-secondary">Manage settings for your companion mobile app.</p>
                </div>
            </div>

            <div className="bg-surface border border-border rounded-xl shadow-lg">
                <div className="p-6 space-y-6">
                    {/* General Settings */}
                    <div className="bg-background p-4 rounded-lg border border-border">
                        <div className="flex justify-between items-center">
                            <div>
                                <h3 className="font-bold text-text-primary">Enable Mobile App Section</h3>
                                <p className="text-sm text-text-secondary mt-1">Show the "Download our App" section on the landing page.</p>
                            </div>
                            <ToggleSwitch checked={appSettings.enabled} onChange={(val) => handleChange('enabled', val)} />
                        </div>
                    </div>
                    {/* Version Control */}
                    <div className="bg-background p-4 rounded-lg border border-border">
                        <h3 className="font-bold text-text-primary mb-4">Version Control</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                             <div>
                                <label className="text-sm text-text-secondary block mb-1">Minimum Android Version</label>
                                <input type="text" value={appSettings.minVersionAndroid} onChange={e => handleChange('minVersionAndroid', e.target.value)} className="w-full bg-surface border border-border rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary text-sm" placeholder="e.g., 1.2.3"/>
                            </div>
                             <div>
                                <label className="text-sm text-text-secondary block mb-1">Minimum iOS Version</label>
                                <input type="text" value={appSettings.minVersionIos} onChange={e => handleChange('minVersionIos', e.target.value)} className="w-full bg-surface border border-border rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary text-sm" placeholder="e.g., 1.2.3"/>
                            </div>
                        </div>
                         <div className="flex justify-between items-center mt-4">
                            <div>
                                <h3 className="font-bold text-text-primary text-sm">Force Update</h3>
                                <p className="text-xs text-text-secondary mt-1">Force users on older app versions to update before they can proceed.</p>
                            </div>
                            <ToggleSwitch checked={appSettings.forceUpdate} onChange={(val) => handleChange('forceUpdate', val)} />
                        </div>
                    </div>
                    {/* Store Links */}
                    <div className="bg-background p-4 rounded-lg border border-border">
                        <h3 className="font-bold text-text-primary mb-4">App Store Links</h3>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                             <div>
                                <label className="text-sm text-text-secondary block mb-1">Google Play Store URL</label>
                                <input type="url" value={appSettings.storeUrlAndroid} onChange={e => handleChange('storeUrlAndroid', e.target.value)} className="w-full bg-surface border border-border rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary text-sm"/>
                            </div>
                             <div>
                                <label className="text-sm text-text-secondary block mb-1">Apple App Store URL</label>
                                <input type="url" value={appSettings.storeUrlIos} onChange={e => handleChange('storeUrlIos', e.target.value)} className="w-full bg-surface border border-border rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary text-sm"/>
                            </div>
                        </div>
                    </div>
                    {/* App Branding */}
                    <div className="bg-background p-4 rounded-lg border border-border">
                        <h3 className="font-bold text-text-primary mb-4 flex items-center gap-2"><Palette size={20} /> App Branding</h3>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                             <div>
                                <label className="text-sm text-text-secondary block mb-1">App Logo URL</label>
                                <input type="url" value={appSettings.appLogoUrl || ''} onChange={e => handleChange('appLogoUrl', e.target.value)} className="w-full bg-surface border border-border rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary text-sm"/>
                                {appSettings.appLogoUrl && <img src={appSettings.appLogoUrl} alt="App Logo Preview" className="mt-2 h-16 w-16 object-contain rounded-md bg-white p-1"/>}
                            </div>
                             <div>
                                <label className="text-sm text-text-secondary block mb-1">Splash Screen URL</label>
                                <input type="url" value={appSettings.splashScreenUrl || ''} onChange={e => handleChange('splashScreenUrl', e.target.value)} className="w-full bg-surface border border-border rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary text-sm"/>
                                {appSettings.splashScreenUrl && <img src={appSettings.splashScreenUrl} alt="Splash Screen Preview" className="mt-2 h-16 w-auto object-contain rounded-md bg-white p-1"/>}
                            </div>
                        </div>
                    </div>
                     {/* Direct Uploads */}
                    <div className="bg-background p-4 rounded-lg border border-border">
                        <h3 className="font-bold text-text-primary mb-2">Direct App Uploads</h3>
                        <p className="text-sm text-text-secondary mb-4">Upload your .apk (Android) and .ipa (iOS) files. If a file is uploaded, it will override the store link and provide a direct download option from the landing page.</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {renderFileUpload('android')}
                            {renderFileUpload('ios')}
                        </div>
                    </div>
                     {/* Maintenance */}
                    <div className="bg-background p-4 rounded-lg border border-border">
                        <div className="flex justify-between items-center">
                            <div>
                                <h3 className="font-bold text-text-primary">Mobile App Maintenance Mode</h3>
                                <p className="text-sm text-text-secondary mt-1">If enabled, mobile app users will see a maintenance screen.</p>
                            </div>
                            <ToggleSwitch checked={appSettings.maintenanceMode} onChange={(val) => handleChange('maintenanceMode', val)} />
                        </div>
                        {appSettings.maintenanceMode && (
                             <div className="mt-4">
                                <label className="text-sm text-text-secondary block mb-1">Maintenance Message</label>
                                <textarea value={appSettings.maintenanceMessage} onChange={e => handleChange('maintenanceMessage', e.target.value)} rows={3} className="w-full bg-surface border border-border rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary text-sm" />
                            </div>
                        )}
                    </div>
                </div>

                 <div className="p-4 bg-background rounded-b-xl flex justify-end">
                    <button onClick={handleSave} className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-semibold py-2 px-6 rounded-lg transition-colors">
                        <Save size={16}/> Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AppManagementPage;
