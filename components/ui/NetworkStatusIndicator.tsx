import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff } from 'lucide-react';

const NetworkStatusIndicator: React.FC = () => {
    const [isOnline, setIsOnline] = useState(navigator.onLine);

    useEffect(() => {
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    const statusText = isOnline ? 'Online' : 'Offline';
    const textColor = isOnline ? 'text-green-400' : 'text-red-400';
    const Icon = isOnline ? Wifi : WifiOff;

    return (
        <div className={`flex items-center gap-1.5 text-xs font-semibold ${textColor}`} title={`Network Status: ${statusText}`}>
            <Icon size={14} />
            <span className="hidden sm:inline">{statusText}</span>
        </div>
    );
};

export default NetworkStatusIndicator;
