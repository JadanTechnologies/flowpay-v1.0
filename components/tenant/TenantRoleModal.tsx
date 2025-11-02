import React, { useState } from 'react';
import { TenantRole, TenantPermission } from '../../types';
import Modal from '../ui/Modal';

interface TenantRoleModalProps {
    role: TenantRole | null;
    onSave: (role: TenantRole) => void;
    onClose: () => void;
    permissionLabels: Record<TenantPermission, string>;
}

const TenantRoleModal: React.FC<TenantRoleModalProps> = ({ role, onSave, onClose, permissionLabels }) => {
    const [name, setName] = useState(role?.name || '');
    const [permissions, setPermissions] = useState<Set<TenantPermission>>(new Set(role?.permissions || []));

    const allPermissions = Object.keys(permissionLabels) as TenantPermission[];

    const handlePermissionChange = (permission: TenantPermission, checked: boolean) => {
        setPermissions(prev => {
            const newPermissions = new Set(prev);
            if (checked) {
                newPermissions.add(permission);
            } else {
                newPermissions.delete(permission);
            }
            return newPermissions;
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ id: role?.id || '', name, permissions: Array.from(permissions) });
    };

    return (
        <Modal title={role ? 'Edit Role' : 'Create New Role'} onClose={onClose}>
            <form onSubmit={handleSubmit}>
                <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                    <div>
                        <label className="text-sm text-text-secondary block mb-1">Role Name</label>
                        <input type="text" value={name} onChange={e => setName(e.target.value)} required className="w-full bg-background border border-border rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary text-sm" />
                    </div>
                    <div>
                        <label className="text-sm text-text-secondary block mb-2">Permissions</label>
                        <div className="grid grid-cols-2 gap-4 bg-background p-4 rounded-md border border-border">
                            {allPermissions.map(permission => (
                                <div key={permission} className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id={`perm-${permission}`}
                                        checked={permissions.has(permission)}
                                        onChange={e => handlePermissionChange(permission, e.target.checked)}
                                        className="h-4 w-4 rounded border-gray-600 text-primary focus:ring-primary bg-surface"
                                    />
                                    <label htmlFor={`perm-${permission}`} className="ml-3 text-sm text-text-primary">
                                        {permissionLabels[permission]}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                 <div className="p-4 bg-background rounded-b-xl flex justify-end gap-2">
                    <button type="button" onClick={onClose} className="bg-border hover:bg-border/70 text-text-primary font-semibold py-2 px-4 rounded-lg text-sm">Cancel</button>
                    <button type="submit" className="bg-primary hover:bg-primary-dark text-white font-semibold py-2 px-4 rounded-lg text-sm">Save Role</button>
                </div>
            </form>
        </Modal>
    );
};

export default TenantRoleModal;