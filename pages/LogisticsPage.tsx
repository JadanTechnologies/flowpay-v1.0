
import React from 'react';
import { Truck, MapPin, User, CheckCircle, AlertTriangle, Clock } from 'lucide-react';
import { drivers, deliveries } from '../data/mockData';
import { Driver, Delivery } from '../types';

const DriverStatusCard: React.FC<{ driver: Driver }> = ({ driver }) => {
    const statusStyles = {
        'Idle': { icon: <CheckCircle className="text-green-500" />, text: 'text-green-400', border: 'border-green-500/30' },
        'On Route': { icon: <Truck className="text-blue-500" />, text: 'text-blue-400', border: 'border-blue-500/30' },
        'On Break': { icon: <Clock className="text-yellow-500" />, text: 'text-yellow-400', border: 'border-yellow-500/30' },
        'In Shop': { icon: <AlertTriangle className="text-red-500" />, text: 'text-red-400', border: 'border-red-500/30' }
    };

    const style = statusStyles[driver.status];

    return (
        <div className={`bg-background p-4 rounded-lg border ${style.border}`}>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <User size={20} className="text-text-secondary"/>
                    <div>
                        <p className="font-semibold text-text-primary">{driver.name}</p>
                        <p className="text-xs text-text-secondary">{driver.assignedTruckId}</p>
                    </div>
                </div>
                <div className={`flex items-center gap-2 text-sm font-medium ${style.text}`}>
                    {style.icon}
                    <span>{driver.status}</span>
                </div>
            </div>
        </div>
    );
};

const getDeliveryStatusBadge = (status: Delivery['status']) => {
    switch(status) {
        case 'Delivered': return <span className="px-2 py-1 text-xs font-medium text-green-300 bg-green-900 rounded-full">{status}</span>;
        case 'In Transit': return <span className="px-2 py-1 text-xs font-medium text-blue-300 bg-blue-900 rounded-full">{status}</span>;
        case 'Pending': return <span className="px-2 py-1 text-xs font-medium text-gray-300 bg-gray-700 rounded-full">{status}</span>;
        case 'Delayed': return <span className="px-2 py-1 text-xs font-medium text-yellow-300 bg-yellow-900 rounded-full">{status}</span>;
        default: return null;
    }
}

const LogisticsPage: React.FC = () => {
    const activeDeliveries = deliveries.filter(d => d.status !== 'Delivered');

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-text-primary">Logistics & GPS Tracking</h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Fleet and Deliveries */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-surface border border-border rounded-xl p-4 shadow-lg">
                        <h2 className="text-xl font-semibold text-text-primary mb-4">Fleet Status</h2>
                        <div className="space-y-3">
                            {drivers.map(driver => <DriverStatusCard key={driver.id} driver={driver}/>)}
                        </div>
                    </div>
                     <div className="bg-surface border border-border rounded-xl p-4 shadow-lg">
                        <h2 className="text-xl font-semibold text-text-primary mb-4">Active Deliveries</h2>
                         <div className="space-y-3">
                            {activeDeliveries.map(delivery => (
                                <div key={delivery.id} className="bg-background p-3 rounded-lg">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="font-semibold text-text-primary text-sm">{delivery.customerName}</p>
                                            <p className="text-xs text-text-secondary">{delivery.destination}</p>
                                        </div>
                                        {getDeliveryStatusBadge(delivery.status)}
                                    </div>
                                    <p className="text-xs text-text-secondary mt-2">Driver: {drivers.find(d => d.id === delivery.driverId)?.name || 'Unassigned'}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column - Map */}
                <div className="lg:col-span-2 bg-surface border border-border rounded-xl p-4 shadow-lg flex flex-col items-center justify-center text-center min-h-[600px]">
                     <MapPin size={64} className="text-primary mb-4" />
                    <h2 className="text-2xl font-semibold text-text-primary mb-2">Live Map Coming Soon</h2>
                    <p className="text-text-secondary max-w-md">
                        This area will feature a real-time interactive map to track your fleet's location, view routes, and set up geofences.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LogisticsPage;
