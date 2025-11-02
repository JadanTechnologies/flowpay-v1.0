import React, { useState } from 'react';
import { SuperAdminStaff, SuperAdminRole, Permission } from '../../types';
import { superAdminStaff, superAdminRoles } from '../../data/mockData';
import Table, { Column } from '../../components/ui/Table';
import Tabs from '../../components/ui/Tabs';
import { Users, Shield, Edit, Trash2, PlusCircle } from 'lucide-react';
import SuperAdminStaffModal from '../../components/superadmin/SuperAdminStaffModal';
import SuperAdminRoleModal from '../../components/superadmin/SuperAdminRoleModal';

const TeamManagementPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'staff' | 'roles'>('staff');
    const [staff, setStaff] = useState<SuperAdminStaff[]>(superAdminStaff);
    const [roles, setRoles] = useState<SuperAdminRole[]>(superAdminRoles);
    const [isStaffModalOpen, setIsStaffModalOpen] = useState(false);
    const [editingStaff, setEditingStaff] = useState<SuperAdminStaff | null>(null);
    const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
    const [editingRole, setEditingRole] = useState<SuperAdminRole | null>(null);

    const openStaffModalForNew = () => {
        setEditingStaff(null);
        setIsStaffModalOpen(true);
    };

    const handleSaveStaff = (staffMember: SuperAdminStaff) => {
        if (editingStaff) {
            setStaff(prev => prev.map(s => s.id === staffMember.id ? staffMember : s));
        } else {
            const newStaff: SuperAdminStaff = { ...staffMember, id: `sa_${Date.now()}` };
            setStaff(prev => [newStaff, ...prev]);
        }
        setIsStaffModalOpen(false);
    };

    const openRoleModalForNew = () => {
        setEditingRole(null);
        setIsRoleModalOpen(true);
    };

    const openRoleModalForEdit = (role: SuperAdminRole) => {
        setEditingRole(role);
        setIsRoleModalOpen(true);
    };

    const handleSaveRole = (role: SuperAdminRole) => {
        if (editingRole) {
            setRoles(prev => prev.map(r => r.id === role.id ? role : r));
        } else {
            const newRole = { ...role, id: `role_${Date.now()}` };
            setRoles(prev => [...prev, newRole]);
        }
        setIsRoleModalOpen(false);
    };

    const handleDeleteRole = (id: string) => {
        if (staff.some(s => s.roleId === id)) {
            alert("Cannot delete role as it is assigned to staff members.");
            return;
        }
        if (window.confirm('Are you sure you want to delete this role?')) {
            setRoles(prev => prev.filter(r => r.id !== id));
        }
    };


    const staffColumns: Column<SuperAdminStaff>[] = [
        {
            header: 'Name', accessor: 'name', render: (row) => (
                <div>
                    <div className="font-medium text-text-primary">{row.name}</div>
                    <div className="text-sm text-text-secondary">{row.email}</div>
                </div>
            )
        },
        {
            header: 'Role', accessor: 'roleId', render: (row) => roles.find(r => r.id === row.roleId)?.name || 'Unknown'
        },
        {
            header: 'Status', accessor: 'status', render: (row) => (
                <span className={`px-2 py-1 text-xs font-medium rounded-full capitalize ${row.status === 'active' ? 'text-green-300 bg-green-900' : 'text-gray-300 bg-gray-700'}`}>
                    {row.status}
                </span>
            )
        },
        {
            header: 'Actions', accessor: 'actions', render: (row) => (
                <div className="flex gap-2">
                    <button className="p-1.5 hover:bg-border rounded-md"><Edit size={14} /></button>
                    <button className="p-1.5 hover:bg-border rounded-md"><Trash2 size={14} className="text-red-400" /></button>
                </div>
            )
        }
    ];

    const permissionLabels: Record<Permission, string> = {
        manage_tenants: 'Manage Tenants',
        manage_billing: 'Manage Billing',
        manage_payments: 'Manage Payments',
        system_settings: 'System Settings',
        manage_team: 'Manage Team',
        view_reports: 'View Reports',
        post_announcements: 'Post Announcements'
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-text-primary">Team Management</h1>
            <div className="bg-surface border border-border rounded-xl shadow-lg">
                <div className="p-6">
                    <Tabs
                        tabs={[
                            { id: 'staff', label: 'Staff', icon: <Users size={16} /> },
                            { id: 'roles', label: 'Roles & Permissions', icon: <Shield size={16} /> },
                        ]}
                        activeTab={activeTab}
                        setActiveTab={(id) => setActiveTab(id as 'staff' | 'roles')}
                    />
                </div>

                <div className="px-6 pb-6">
                    {activeTab === 'staff' && (
                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-semibold text-text-primary">Admin Users</h2>
                                <button onClick={openStaffModalForNew} className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm">
                                    <PlusCircle size={16} /> Create Staff
                                </button>
                            </div>
                            <Table columns={staffColumns} data={staff} />
                        </div>
                    )}
                    {activeTab === 'roles' && (
                        <div>
                             <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-semibold text-text-primary">Roles</h2>
                                <button onClick={openRoleModalForNew} className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm">
                                    <PlusCircle size={16} /> Create Role
                                </button>
                            </div>
                            <div className="space-y-4">
                                {roles.map(role => (
                                    <div key={role.id} className="bg-background p-4 rounded-lg border border-border">
                                        <div className="flex justify-between items-center">
                                            <h3 className="font-bold text-primary">{role.name}</h3>
                                            <div className="flex gap-2">
                                                <button onClick={() => openRoleModalForEdit(role)} className="p-1.5 hover:bg-border rounded-md"><Edit size={14} /></button>
                                                <button onClick={() => handleDeleteRole(role.id)} className="p-1.5 hover:bg-border rounded-md"><Trash2 size={14} className="text-red-400" /></button>
                                            </div>
                                        </div>
                                        <p className="text-sm text-text-secondary mt-2">Permissions:</p>
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {role.permissions.map(perm => (
                                                <span key={perm} className="px-2 py-1 text-xs font-medium text-blue-300 bg-blue-900 rounded-full">
                                                    {permissionLabels[perm]}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
            {isStaffModalOpen && (
                <SuperAdminStaffModal
                    staffMember={editingStaff}
                    roles={roles}
                    onSave={handleSaveStaff}
                    onClose={() => setIsStaffModalOpen(false)}
                />
            )}
            {isRoleModalOpen && (
                <SuperAdminRoleModal
                    role={editingRole}
                    onSave={handleSaveRole}
                    onClose={() => setIsRoleModalOpen(false)}
                    permissionLabels={permissionLabels}
                />
            )}
        </div>
    );
};

export default TeamManagementPage;