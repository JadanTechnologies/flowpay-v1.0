import React, { useState } from 'react';
import { Truck, User, PlusCircle, Edit, Trash2 } from 'lucide-react';
import { useAppContext } from '../../contexts/AppContext';
import { Truck as TruckType, Driver as DriverType } from '../../types';
import Table, { Column } from '../../components/ui/Table';
import Tabs from '../../components/ui/Tabs';
import Modal from '../../components/ui/Modal';

// Truck Form Modal
const TruckFormModal: React.FC<{ truck: TruckType | null; onSave: (truck: TruckType) => void; onClose: () => void; }> = ({ truck, onSave, onClose }) => {
    const [formData, setFormData] = useState<Omit<TruckType, 'id'>>(truck || { licensePlate: '', model: '', capacity: 1000, status: 'Idle' });
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData(prev => ({...prev, [e.target.name]: e.target.type === 'number' ? parseFloat(e.target.value) : e.target.value}));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ ...formData, id: truck?.id || '' });
    };

    return (
        <Modal title={truck ? 'Edit Truck' : 'Add New Truck'} onClose={onClose}>
            <form onSubmit={handleSubmit}>
                <div className="p-6 space-y-4">
                    <input type="text" name="licensePlate" placeholder="License Plate" value={formData.licensePlate} onChange={handleChange} required className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm" />
                    <input type="text" name="model" placeholder="Model (e.g., Ford Transit)" value={formData.model} onChange={handleChange} required className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm" />
                    <input type="number" name="capacity" placeholder="Capacity (kg)" value={formData.capacity} onChange={handleChange} required className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm" />
                    <select name="status" value={formData.status} onChange={handleChange} className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm">
                        <option value="Idle">Idle</option>
                        <option value="Loading">Loading</option>
                        <option value="On Route">On Route</option>
                        <option value="Maintenance">Maintenance</option>
                    </select>
                </div>
                <div className="p-4 bg-background flex justify-end gap-2"><button type="button" onClick={onClose}>Cancel</button><button type="submit">Save</button></div>
            </form>
        </Modal>
    );
}

// Driver Form Modal
const DriverFormModal: React.FC<{ driver: DriverType | null; onSave: (driver: DriverType) => void; onClose: () => void; }> = ({ driver, onSave, onClose }) => {
    const { trucks } = useAppContext();
    const [formData, setFormData] = useState<Omit<DriverType, 'id'>>(driver || { name: '', licenseNumber: '', phone: '', status: 'Idle' });
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData(prev => ({...prev, [e.target.name]: e.target.value}));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ ...formData, id: driver?.id || '' });
    };

    return (
        <Modal title={driver ? 'Edit Driver' : 'Add New Driver'} onClose={onClose}>
            <form onSubmit={handleSubmit}>
                <div className="p-6 space-y-4">
                    <input type="text" name="name" placeholder="Driver's Full Name" value={formData.name} onChange={handleChange} required className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm" />
                    <input type="text" name="licenseNumber" placeholder="Driver's License Number" value={formData.licenseNumber} onChange={handleChange} required className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm" />
                    <input type="tel" name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} required className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm" />
                    <select name="assignedTruckId" value={formData.assignedTruckId || ''} onChange={handleChange} className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm">
                        <option value="">Unassigned</option>
                        {trucks.map(t => <option key={t.id} value={t.id}>{t.licensePlate} ({t.model})</option>)}
                    </select>
                    <select name="status" value={formData.status} onChange={handleChange} className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm">
                        <option value="Idle">Idle</option>
                        <option value="On Route">On Route</option>
                        <option value="On Break">On Break</option>
                        <option value="In Shop">In Shop</option>
                    </select>
                </div>
                <div className="p-4 bg-background flex justify-end gap-2"><button type="button" onClick={onClose}>Cancel</button><button type="submit">Save</button></div>
            </form>
        </Modal>
    );
}

const FleetPage: React.FC = () => {
    const { trucks, setTrucks, drivers, setDrivers } = useAppContext();
    const [activeTab, setActiveTab] = useState<'trucks' | 'drivers'>('trucks');

    const [isTruckModalOpen, setIsTruckModalOpen] = useState(false);
    const [editingTruck, setEditingTruck] = useState<TruckType | null>(null);

    const [isDriverModalOpen, setIsDriverModalOpen] = useState(false);
    const [editingDriver, setEditingDriver] = useState<DriverType | null>(null);
    
    // Truck handlers
    const handleSaveTruck = (truck: TruckType) => {
        if (editingTruck) {
            setTrucks(prev => prev.map(t => t.id === truck.id ? truck : t));
        } else {
            setTrucks(prev => [{ ...truck, id: `truck_${Date.now()}` }, ...prev]);
        }
        setIsTruckModalOpen(false);
    };

    const handleDeleteTruck = (id: string) => {
        if (window.confirm('Are you sure you want to delete this truck?')) {
            setTrucks(prev => prev.filter(t => t.id !== id));
        }
    };
    
    // Driver handlers
    const handleSaveDriver = (driver: DriverType) => {
        if (editingDriver) {
            setDrivers(prev => prev.map(d => d.id === driver.id ? driver : d));
        } else {
            setDrivers(prev => [{ ...driver, id: `drv_${Date.now()}` }, ...prev]);
        }
        setIsDriverModalOpen(false);
    };

     const handleDeleteDriver = (id: string) => {
        if (window.confirm('Are you sure you want to delete this driver?')) {
            setDrivers(prev => prev.filter(d => d.id !== id));
        }
    };

    const truckColumns: Column<TruckType>[] = [
        { header: 'License Plate', accessor: 'licensePlate', sortable: true },
        { header: 'Model', accessor: 'model', sortable: true },
        { header: 'Capacity (kg)', accessor: 'capacity', sortable: true },
        { header: 'Status', accessor: 'status' },
        {
            header: 'Actions', accessor: 'actions', render: (row) => (
                <div className="flex gap-2">
                    <button onClick={() => { setEditingTruck(row); setIsTruckModalOpen(true); }}><Edit size={14} /></button>
                    <button onClick={() => handleDeleteTruck(row.id)}><Trash2 size={14} className="text-red-400" /></button>
                </div>
            )
        }
    ];

    const driverColumns: Column<DriverType>[] = [
        { header: 'Name', accessor: 'name', sortable: true },
        { header: 'License Number', accessor: 'licenseNumber' },
        { header: 'Phone', accessor: 'phone' },
        { header: 'Assigned Truck', accessor: 'assignedTruckId', render: (row) => trucks.find(t => t.id === row.assignedTruckId)?.licensePlate || 'Unassigned' },
        { header: 'Status', accessor: 'status' },
        {
            header: 'Actions', accessor: 'actions', render: (row) => (
                <div className="flex gap-2">
                    <button onClick={() => { setEditingDriver(row); setIsDriverModalOpen(true); }}><Edit size={14} /></button>
                    <button onClick={() => handleDeleteDriver(row.id)}><Trash2 size={14} className="text-red-400" /></button>
                </div>
            )
        }
    ];

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-text-primary">Fleet Management</h1>
            <div className="bg-surface border border-border rounded-xl shadow-lg">
                <div className="p-6">
                    <Tabs
                        tabs={[
                            { id: 'trucks', label: 'Trucks', icon: <Truck size={16} /> },
                            { id: 'drivers', label: 'Drivers', icon: <User size={16} /> },
                        ]}
                        activeTab={activeTab}
                        setActiveTab={(id) => setActiveTab(id as 'trucks' | 'drivers')}
                    />
                </div>
                <div className="px-6 pb-6">
                    {activeTab === 'trucks' && (
                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-semibold text-text-primary">All Trucks</h2>
                                <button onClick={() => { setEditingTruck(null); setIsTruckModalOpen(true); }} className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm">
                                    <PlusCircle size={16} /> Add Truck
                                </button>
                            </div>
                            <Table columns={truckColumns} data={trucks} />
                        </div>
                    )}
                    {activeTab === 'drivers' && (
                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-semibold text-text-primary">All Drivers</h2>
                                <button onClick={() => { setEditingDriver(null); setIsDriverModalOpen(true); }} className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm">
                                    <PlusCircle size={16} /> Add Driver
                                </button>
                            </div>
                            <Table columns={driverColumns} data={drivers} />
                        </div>
                    )}
                </div>
            </div>
            
            {isTruckModalOpen && <TruckFormModal truck={editingTruck} onSave={handleSaveTruck} onClose={() => setIsTruckModalOpen(false)} />}
            {isDriverModalOpen && <DriverFormModal driver={editingDriver} onSave={handleSaveDriver} onClose={() => setIsDriverModalOpen(false)} />}
        </div>
    );
};

export default FleetPage;
