
import React, { useState } from 'react';
import { SubscriptionPlan, ModuleId } from '../../types';
import Modal from '../ui/Modal';

interface SubscriptionPlanModalProps {
    plan?: SubscriptionPlan;
    onClose: () => void;
    onSave: (plan: SubscriptionPlan) => void;
}

const allModules: { id: ModuleId, name: string }[] = [
    { id: 'dashboard', name: 'Dashboard' },
    { id: 'pos', name: 'POS' },
    { id: 'inventory', name: 'Inventory' },
    { id: 'reports', name: 'Reports' },
    { id: 'logistics', name: 'Logistics' },
    { id: 'branches', name: 'Branch Management' },
    { id: 'staff', name: 'Staff Management' },
    { id: 'automations', name: 'Automations' },
    { id: 'invoicing', name: 'Invoicing' },
    { id: 'credit_management', name: 'Credit Management' },
    { id: 'activityLog', name: 'Activity Log' },
];

const SubscriptionPlanModal: React.FC<SubscriptionPlanModalProps> = ({ plan, onClose, onSave }) => {
    const [formData, setFormData] = useState<Omit<SubscriptionPlan, 'enabledModules'>>(plan || {
        id: '',
        name: '',
        price: 0,
        description: '',
        features: [''],
        branchLimit: 0,
        userLimit: 0,
    });
    const [enabledModules, setEnabledModules] = useState<Set<ModuleId>>(new Set(plan?.enabledModules || []));

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: name === 'price' || name === 'branchLimit' || name === 'userLimit' ? parseInt(value) : value }));
    };

    const handleFeatureChange = (index: number, value: string) => {
        const newFeatures = [...formData.features];
        newFeatures[index] = value;
        setFormData(prev => ({ ...prev, features: newFeatures }));
    };

    const addFeature = () => {
        setFormData(prev => ({ ...prev, features: [...prev.features, ''] }));
    };
    
    const removeFeature = (index: number) => {
        setFormData(prev => ({ ...prev, features: formData.features.filter((_, i) => i !== index) }));
    };

    const handleModuleChange = (moduleId: ModuleId, checked: boolean) => {
        setEnabledModules(prev => {
            const newSet = new Set(prev);
            if (checked) {
                newSet.add(moduleId);
            } else {
                newSet.delete(moduleId);
            }
            return newSet;
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ ...formData, enabledModules: Array.from(enabledModules) });
    };

    return (
        <Modal title={plan ? 'Edit Subscription Plan' : 'Create New Plan'} onClose={onClose}>
            <form onSubmit={handleSubmit}>
                <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                    <div>
                        <label className="text-sm text-text-secondary block mb-1">Plan Name</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full bg-background border border-border rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary text-sm" />
                    </div>
                     <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm text-text-secondary block mb-1">Price (per month)</label>
                            <input type="number" name="price" value={formData.price} onChange={handleChange} required className="w-full bg-background border border-border rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary text-sm" />
                        </div>
                    </div>
                    <div>
                        <label className="text-sm text-text-secondary block mb-1">Description</label>
                        <textarea name="description" value={formData.description} onChange={handleChange} rows={2} className="w-full bg-background border border-border rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary text-sm" />
                    </div>
                    <div>
                        <label className="text-sm text-text-secondary block mb-1">Limits</label>
                         <div className="grid grid-cols-2 gap-4">
                            <input type="number" name="userLimit" placeholder="User Limit" value={formData.userLimit} onChange={handleChange} required className="w-full bg-background border border-border rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary text-sm" />
                            <input type="number" name="branchLimit" placeholder="Branch Limit" value={formData.branchLimit} onChange={handleChange} required className="w-full bg-background border border-border rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary text-sm" />
                        </div>
                    </div>
                    <div>
                        <label className="text-sm text-text-secondary block mb-1">Features (Marketing List)</label>
                        {formData.features.map((feature, index) => (
                            <div key={index} className="flex items-center gap-2 mb-2">
                                <input
                                    type="text"
                                    value={feature}
                                    onChange={(e) => handleFeatureChange(index, e.target.value)}
                                    className="w-full bg-background border border-border rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary text-sm"
                                />
                                <button type="button" onClick={() => removeFeature(index)} className="text-red-500 hover:text-red-400">X</button>
                            </div>
                        ))}
                        <button type="button" onClick={addFeature} className="text-sm text-primary hover:underline">+ Add Feature</button>
                    </div>

                    <div>
                        <label className="text-sm text-text-secondary block mb-1">Enabled Modules</label>
                        <div className="grid grid-cols-2 gap-2 p-3 bg-background rounded-md border border-border">
                            {allModules.map(module => (
                                <div key={module.id} className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id={`module-${module.id}`}
                                        checked={enabledModules.has(module.id)}
                                        onChange={e => handleModuleChange(module.id, e.target.checked)}
                                        className="h-4 w-4 rounded border-gray-600 text-primary focus:ring-primary bg-surface"
                                    />
                                    <label htmlFor={`module-${module.id}`} className="ml-2 text-sm text-text-primary">{module.name}</label>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
                 <div className="p-4 bg-background rounded-b-xl flex justify-end gap-2">
                    <button type="button" onClick={onClose} className="bg-border hover:bg-border/70 text-text-primary font-semibold py-2 px-4 rounded-lg text-sm">Cancel</button>
                    <button type="submit" className="bg-primary hover:bg-primary-dark text-white font-semibold py-2 px-4 rounded-lg text-sm">Save Plan</button>
                </div>
            </form>
        </Modal>
    );
};

export default SubscriptionPlanModal;
