import React, { useState, useEffect } from 'react';
import { Device } from '../../types';
import { useAppContext } from '../../contexts/AppContext';
import ToggleSwitch from '../../components/ui/ToggleSwitch';
import Table, { Column } from '../../components/ui/Table';
import { Trash2, Check, X, PlusCircle } from 'lucide-react';
import Skeleton from '../../components/ui/Skeleton';

const AccessControlPage: React.FC = () => {
    const { approvedDevices, setApprovedDevices, pendingDevices, setPendingDevices } = useAppContext();
    const [isPolicyEnabled, setIsPolicyEnabled] = useState(false);

    useEffect(() => {
        const isPrivateIp = (ip: string) => {
            // Simple check for private IP ranges
            return ip.startsWith('192.168.') || ip.startsWith('10.') || ip.startsWith('172.');
        };

        const fetchDeviceLocations = async (devices: Device[], setter: React.Dispatch<React.SetStateAction<Device[]>>) => {
            const devicesToUpdate = devices.filter(d => !d.location && !isPrivateIp(d.ipAddress));

            if (devicesToUpdate.length === 0) {
                return;
            }

            const updatedDevicesPromises = devices.map(async (device) => {
                if (!device.location && !isPrivateIp(device.ipAddress)) {
                    try {
                        await new Promise(resolve => setTimeout(resolve, Math.random() * 1000 + 500)); // Simulate varied network delay
                        const response = await fetch(`https://ip-api.com/json/${device.ipAddress}?fields=city,country,isp`);
                        if (!response.ok) return { ...device, location: 'Lookup Failed', isp: 'N/A' };
                        const data = await response.json();
                        return {
                            ...device,
                            location: data.city && data.country ? `${data.city}, ${data.country}` : 'N/A',
                            isp: data.isp || 'N/A',
                        };
                    } catch (e) {
                        console.error(`Failed to fetch location for IP ${device.ipAddress}`, e);
                        return { ...device, location: 'Lookup Error', isp: 'N/A' };
                    }
                }
                return device;
            });

            const resolvedDevices = await Promise.all(updatedDevicesPromises);
            setter(resolvedDevices);
        };

        fetchDeviceLocations(approvedDevices, setApprovedDevices);
        fetchDeviceLocations(pendingDevices, setPendingDevices);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Run only once on mount

    const handleRevoke = (id: string) => {
        if (window.confirm('Are you sure you want to revoke access for this device? The user will need to request approval again.')) {
            setApprovedDevices(prev => prev.filter(d => d.id !== id));
        }
    };

    const handleApprove = (id: string) => {
        const deviceToApprove = pendingDevices.find(d => d.id === id);
        if (deviceToApprove) {
            setApprovedDevices(prev => [...prev, deviceToApprove]);
            setPendingDevices(prev => prev.filter(d => d.id !== id));
        }
    };
    
    const handleDeny = (id: string) => {
        setPendingDevices(prev => prev.filter(d => d.id !== id));
    };

    const handleSimulateRequest = async () => {
        const newDevice: Device = {
            id: `dev_${Date.now()}`,
            staffName: 'Diana Prince',
            name: 'Pixel 8 Pro',
            os: 'Android 15',
            browser: 'Firefox',
            ipAddress: '8.8.8.8', // Google's DNS
            lastLogin: new Date().toLocaleString(),
        };
        setPendingDevices(prev => [newDevice, ...prev]);

        try {
            await new Promise(resolve => setTimeout(resolve, 500)); // Simulate delay
            const response = await fetch(`https://ip-api.com/json/${newDevice.ipAddress}?fields=city,country,isp`);
            if (!response.ok) throw new Error('Failed to fetch IP details');
            const data = await response.json();

            setPendingDevices(prev => prev.map(d => 
                d.id === newDevice.id 
                ? { ...d, location: `${data.city}, ${data.country}`, isp: data.isp } 
                : d
            ));
        } catch (error) {
            console.error("Error simulating device request:", error);
            setPendingDevices(prev => prev.map(d => d.id === newDevice.id ? { ...d, location: 'Lookup Failed', isp: 'N/A' } : d));
        }
    };
    
    const LocationSkeleton = () => (
        <div>
            <Skeleton className="h-4 w-24 mb-1" />
            <Skeleton className="h-3 w-20" />
        </div>
    );

    const approvedColumns: Column<Device>[] = [
        { header: 'Device / OS', accessor: 'name', render: (row) => `${row.name} (${row.os})` },
        { header: 'Browser', accessor: 'browser' },
        { header: 'Last Login', accessor: 'lastLogin', sortable: true },
        { header: 'IP Address', accessor: 'ipAddress' },
        {
            header: 'Location & ISP',
            accessor: 'location' as any, // To satisfy typing, as location is optional
            render: (row) => row.location ? (
                <div>
                    <div className="font-medium text-text-primary">{row.location}</div>
                    <div className="text-xs text-text-secondary">{row.isp}</div>
                </div>
            ) : <LocationSkeleton />
        },
        {
            header: 'Actions',
            accessor: 'actions',
            render: (row) => (
                <button onClick={() => handleRevoke(row.id)} className="flex items-center gap-1 text-xs bg-red-600/20 text-red-400 font-semibold py-1 px-2 rounded-lg hover:bg-red-600/40">
                    <Trash2 size={14} /> Revoke
                </button>
            )
        }
    ];

    const pendingColumns: Column<Device>[] = [
        { header: 'Staff Member', accessor: 'staffName' },
        { header: 'Device / OS', accessor: 'name', render: (row) => `${row.name} (${row.os})` },
        { header: 'IP Address', accessor: 'ipAddress' },
        {
            header: 'Location & ISP',
            accessor: 'location' as any,
            render: (row) => row.location ? (
                <div>
                    <div className="font-medium text-text-primary">{row.location}</div>
                    <div className="text-xs text-text-secondary">{row.isp}</div>
                </div>
            ) : <LocationSkeleton />
        },
        {
            header: 'Actions',
            accessor: 'actions',
            render: (row) => (
                <div className="flex gap-2">
                    <button onClick={() => handleApprove(row.id)} className="flex items-center gap-1 text-xs bg-green-600/20 text-green-400 font-semibold py-1 px-2 rounded-lg hover:bg-green-600/40">
                        <Check size={14} /> Approve
                    </button>
                     <button onClick={() => handleDeny(row.id)} className="flex items-center gap-1 text-xs bg-red-600/20 text-red-400 font-semibold py-1 px-2 rounded-lg hover:bg-red-600/40">
                        <X size={14} /> Deny
                    </button>
                </div>
            )
        }
    ];

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-bold text-text-primary">Device Access Control</h2>
                <p className="text-text-secondary mt-1">Manage which devices can access your business account.</p>
            </div>

            <div className="bg-background p-4 rounded-lg border border-border">
                <div className="flex justify-between items-center">
                    <div>
                        <h3 className="font-bold text-text-primary">Enable Strict Device Policy</h3>
                        <p className="text-sm text-text-secondary mt-1">If enabled, only devices from the "Approved" list below can log in.</p>
                    </div>
                    <ToggleSwitch checked={isPolicyEnabled} onChange={setIsPolicyEnabled} />
                </div>
            </div>

            {pendingDevices.length > 0 && (
                 <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-text-primary">Pending Approval Requests</h3>
                    <div className="bg-background rounded-lg border border-border p-4">
                        <Table columns={pendingColumns} data={pendingDevices} />
                    </div>
                </div>
            )}

            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-text-primary">Approved Devices</h3>
                    <button onClick={handleSimulateRequest} className="flex items-center gap-2 text-sm bg-blue-600/20 text-blue-400 font-semibold py-1 px-3 rounded-lg hover:bg-blue-600/40">
                        <PlusCircle size={14} /> Simulate New Device Request
                    </button>
                </div>
                <div className="bg-background rounded-lg border border-border p-4">
                    <Table columns={approvedColumns} data={approvedDevices} />
                </div>
            </div>
        </div>
    );
};

export default AccessControlPage;