import React, { useState } from 'react';
import { SubscriptionPlan } from '../../types';
import Modal from '../ui/Modal';

interface SubscriptionPlanModalProps {
    plan?: SubscriptionPlan;
    onClose: () => void;
    onSave: (plan: SubscriptionPlan) => void;
}

const SubscriptionPlanModal: React.FC<SubscriptionPlanModalProps> = ({ plan, onClose, onSave }) => {
    const [formData, setFormData] = useState<SubscriptionPlan>(plan || {
        id: '',
        name: '',
        price: 0,
        description: '',
        features: [''],
        branchLimit: 0,
        userLimit: 0,
    });

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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
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
                        <label className="text-sm text-text-secondary block mb-1">Features</label>
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
