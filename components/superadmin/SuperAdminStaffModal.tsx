import React, { useState } from 'react';
import { SuperAdminStaff, SuperAdminRole } from '../../types';
import Modal from '../ui/Modal';
import { Eye, EyeOff } from 'lucide-react';

interface SuperAdminStaffModalProps {
    staffMember: SuperAdminStaff | null;
    roles: SuperAdminRole[];
    onSave: (staffMember: SuperAdminStaff) => void;
    onClose: () => void;
}

const SuperAdminStaffModal: React.FC<SuperAdminStaffModalProps> = ({ staffMember, roles, onSave, onClose }) => {
    const [formData, setFormData] = useState<Omit<SuperAdminStaff, 'id'>>(staffMember || {
        name: '',
        email: '',
        password: '',
        roleId: roles[0]?.id || '',
        status: 'active',
    });
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!staffMember && (!formData.password || formData.password.length < 6)) {
            alert('Password must be at least 6 characters long for new staff.');
            return;
        }
        onSave({ ...formData, id: staffMember?.id || '' });
    };

    return (
        <Modal title={staffMember ? 'Edit Staff Member' : 'Create New Staff'} onClose={onClose}>
            <form onSubmit={handleSubmit}>
                <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm text-text-secondary block mb-1">Full Name</label>
                            <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full bg-background border border-border rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary text-sm" />
                        </div>
                        <div>
                            <label className="text-sm text-text-secondary block mb-1">Email Address</label>
                            <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full bg-background border border-border rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary text-sm" />
                        </div>
                    </div>
                    <div>
                        <label className="text-sm text-text-secondary block mb-1">Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                placeholder={staffMember ? "New Password (optional)" : "Password"}
                                value={formData.password || ''}
                                onChange={handleChange}
                                required={!staffMember}
                                className="w-full bg-background border border-border rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary text-sm"
                            />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-2 top-1/2 -translate-y-1/2 text-text-secondary">
                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm text-text-secondary block mb-1">Role</label>
                            <select name="roleId" value={formData.roleId} onChange={handleChange} className="w-full bg-background border border-border rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary text-sm">
                                {roles.map(role => (
                                    <option key={role.id} value={role.id}>{role.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="text-sm text-text-secondary block mb-1">Status</label>
                            <select name="status" value={formData.status} onChange={handleChange} className="w-full bg-background border border-border rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary text-sm">
                                <option value="active">Active</option>
                                <option value="disabled">Disabled</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div className="p-4 bg-background rounded-b-xl flex justify-end gap-2">
                    <button type="button" onClick={onClose} className="bg-border hover:bg-border/70 text-text-primary font-semibold py-2 px-4 rounded-lg text-sm">Cancel</button>
                    <button type="submit" className="bg-primary hover:bg-primary-dark text-white font-semibold py-2 px-4 rounded-lg text-sm">Save Staff</button>
                </div>
            </form>
        </Modal>
    );
};

export default SuperAdminStaffModal;