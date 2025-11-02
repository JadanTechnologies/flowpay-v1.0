import React, { useState } from 'react';
import { Customer } from '../../types';
import Modal from '../ui/Modal';

interface CustomerFormModalProps {
    onClose: () => void;
    onSave: (customer: Omit<Customer, 'id' | 'creditBalance'>) => void;
}

const CustomerFormModal: React.FC<CustomerFormModalProps> = ({ onClose, onSave }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({...prev, [e.target.name]: e.target.value}));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(!formData.name) {
            alert('Customer name is required.');
            return;
        }
        onSave(formData);
    }
    
    return (
        <Modal title="Add New Customer" onClose={onClose}>
            <form onSubmit={handleSubmit}>
                <div className="p-6 space-y-4">
                    <div>
                        <label className="text-sm text-text-secondary block mb-1">Customer Name</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full bg-background border border-border rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary text-sm" />
                    </div>
                    <div>
                        <label className="text-sm text-text-secondary block mb-1">Email (Optional)</label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full bg-background border border-border rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary text-sm" />
                    </div>
                    <div>
                        <label className="text-sm text-text-secondary block mb-1">Phone (Optional)</label>
                        <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full bg-background border border-border rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary text-sm" />
                    </div>
                </div>
                <div className="p-4 bg-background rounded-b-xl flex justify-end gap-2">
                    <button type="button" onClick={onClose} className="bg-border hover:bg-border/70 text-text-primary font-semibold py-2 px-4 rounded-lg text-sm">Cancel</button>
                    <button type="submit" className="bg-primary hover:bg-primary-dark text-white font-semibold py-2 px-4 rounded-lg text-sm">Save Customer</button>
                </div>
            </form>
        </Modal>
    )
}

export default CustomerFormModal;