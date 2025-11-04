import React, { useState } from 'react';
import { Users, UserPlus, MoreVertical, Edit, Trash2, Eye, EyeOff, UserCheck, Shield, PlusCircle } from 'lucide-react';
import { Staff, TenantPermission, TenantRole } from '../../types';
import Table, { Column } from '../../components/ui/Table';
import Modal from '../../components/ui/Modal';
import { staff as mockStaff, branches as mockBranches } from '../../data/mockData';
import { useAppContext } from '../../contexts/AppContext';
import { useNavigate } from 'react-router-dom';
import Tabs from '../../components/ui/Tabs';
import TenantRoleModal from '../../components/tenant/TenantRoleModal';

const StaffFormModal: React.FC<{ staff: Staff | null; onSave: (staff: Staff) => void; onClose: () => void; }> = ({ staff, onSave, onClose }) => {
    const { tenantRoles } = useAppContext();
    const [formData, setFormData] = useState<Omit<Staff, 'id'>>({ 
        name: staff?.name || '', 
        email: staff?.email || '', 
        username: staff?.username || '',
        password: '',
        roleId: staff?.roleId || (tenantRoles.length > 0 ? tenantRoles[0].id : ''), 
        branch: staff?.branch || mockBranches[0]?.name || '', 
        status: staff?.status || 'active' 
    });
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!staff && (!formData.password || formData.password.length < 6)) {
            alert('Password must be at least 6 characters long for new staff.');
            return;
        }
        onSave({ ...formData, id: staff?.id || '' });
    };

    return (
        <Modal title={staff ? 'Edit Staff Member' : 'Add New Staff'} onClose={onClose}>
            <form onSubmit={handleSubmit}>
                <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} required className="w-full bg-background border border-border rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary text-sm" />
                        <input type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleChange} required className="w-full bg-background border border-border rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary text-sm" />
                    </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         <input type="text" name="username" placeholder="Username" value={formData.username} onChange={handleChange} required className="w-full bg-background border border-border rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary text-sm" />
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                placeholder={staff ? "New Password (optional)" : "Password"}
                                value={formData.password || ''}
                                onChange={handleChange}
                                required={!staff} // Only required for new staff
                                className="w-full bg-background border border-border rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary text-sm"
                            />
                             <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-2 top-1/2 -translate-y-1/2 text-text-secondary">
                                {showPassword ? <EyeOff size={16}/> : <Eye size={16}/>}
                            </button>
                        </div>
                    </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <select name="roleId" value={formData.roleId} onChange={handleChange} className="w-full bg-background border border-border rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary text-sm">
                            {tenantRoles.map(role => <option key={role.id} value={role.id}>{role.name}</option>)}
                        </select>
                        <select name="branch" value={formData.branch} onChange={handleChange} className="w-full bg-background border border-border rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary text-sm">
                            {mockBranches.map(b => <option key={b.id} value={b.name}>{b.name}</option>)}
                        </select>
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

const StaffManagementPage: React.FC = () => {
    const { session, impersonateStaff, tenantRoles, setTenantRoles } = useAppContext();
    const navigate = useNavigate();
    const [staff, setStaff] = useState<Staff[]>(mockStaff);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingStaff, setEditingStaff] = useState<Staff | null>(null);
    const [activeTab, setActiveTab] = useState<'staff' | 'roles'>('staff');
    const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
    const [editingRole, setEditingRole] = useState<TenantRole | null>(null);

    const openModalForNew = () => {
        setEditingStaff(null);
        setIsModalOpen(true);
    };

    const openModalForEdit = (staffMember: Staff) => {
        setEditingStaff(staffMember);
        setIsModalOpen(true);
    };
    
    const handleSave = (staffMember: Staff) => {
        if (editingStaff) {
            setStaff(staff.map(s => s.id === staffMember.id ? staffMember : s));
        } else {
            const newStaff = { ...staffMember, id: `stf_${new Date().getTime()}` };
            setStaff([newStaff, ...staff]);
        }
        setIsModalOpen(false);
    };

    const handleDelete = (id: string) => {
        if (window.confirm('Are you sure you want to delete this staff member?')) {
            setStaff(staff.filter(s => s.id !== id));
        }
    };

    const handleImpersonate = (staffMember: Staff) => {
        if (window.confirm(`Are you sure you want to impersonate ${staffMember.name}?`)) {
            impersonateStaff(staffMember, navigate);
        }
    };

    const openRoleModalForNew = () => {
        setEditingRole(null);
        setIsRoleModalOpen(true);
    };

    const openRoleModalForEdit = (role: TenantRole) => {
        setEditingRole(role);
        setIsRoleModalOpen(true);
    };

    const handleSaveRole = (role: TenantRole) => {
        if (editingRole) {
            setTenantRoles(prev => prev.map(r => r.id === role.id ? role : r));
        } else {
            const newRole = { ...role, id: `trole_${Date.now()}` };
            setTenantRoles(prev => [...prev, newRole]);
        }
        setIsRoleModalOpen(false);
    };
    
    const handleDeleteRole = (id: string) => {
        if (staff.some(s => s.roleId === id)) {
            alert("Cannot delete role as it is currently assigned to staff members.");
            return;
        }
        if (window.confirm('Are you sure you want to delete this role?')) {
            setTenantRoles(prev => prev.filter(r => r.id !== id));
        }
    };

    const columns: Column<Staff>[] = [
        {
            header: 'Name', accessor: 'name', sortable: true, render: (row) => (
                <div>
                    <div className="font-medium text-text-primary">{row.name}</div>
                    <div className="text-sm text-text-secondary">{row.email}</div>
                </div>
            )
        },
        { header: 'Username', accessor: 'username', sortable: true },
        { header: 'Role', accessor: 'roleId', sortable: true, render: (row) => tenantRoles.find(r => r.id === row.roleId)?.name || 'Unassigned' },
        { header: 'Branch', accessor: 'branch', sortable: true },
        {
            header: 'Status', accessor: 'status', sortable: true, render: (row) => (
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${row.status === 'active' ? 'text-green-300 bg-green-900' : 'text-yellow-300 bg-yellow-900'}`}>
                    {row.status === 'active' ? 'Active' : 'On Leave'}
                </span>
            )
        },
        {
            header: 'Actions', accessor: 'actions', render: (row) => (
                <div className="group relative text-right">
                    <button className="p-1.5 rounded-md hover:bg-border"><MoreVertical size={16} /></button>
                    <div className="absolute right-0 mt-1 w-32 bg-surface border border-border rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity invisible group-hover:visible z-10">
                        {session?.user?.email !== row.email && (
                            <button onClick={() => handleImpersonate(row)} className="w-full text-left flex items-center gap-2 px-3 py-2 text-sm text-text-secondary hover:bg-background">
                                <UserCheck size={14} /> Impersonate
                            </button>
                        )}
                        <button onClick={() => openModalForEdit(row)} className="w-full text-left flex items-center gap-2 px-3 py-2 text-sm text-text-secondary hover:bg-background"><Edit size={14} /> Edit</button>
                        <button onClick={() => handleDelete(row.id)} className="w-full text-left flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-background"><Trash2 size={14} /> Delete</button>
                    </div>
                </div>
            )
        }
    ];

// FIX: The 'view_accounting' permission is invalid. It has been corrected to 'view_reports'. The list of permissions has also been completed to match the TenantPermission type definition.
     const permissionLabels: Record<TenantPermission, string> = {
        manage_pos: 'Manage POS',
        manage_inventory: 'Manage Inventory',
        manage_staff: 'Manage Staff',
        manage_branches: 'Manage Branches',
        manage_automations: 'Manage Automations',
        view_reports: 'View Reports',
        process_returns: 'Process Returns',
        access_settings: 'Access Settings',
        manage_logistics: 'Manage Logistics',
        manage_invoicing: 'Manage Invoicing',
        manage_credit: 'Manage Credit',
        view_activity_log: 'View Activity Log'
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-text-primary">Staff Management</h1>
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
                                <h2 className="text-xl font-semibold text-text-primary">Staff Members</h2>
                                <button onClick={openModalForNew} className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm">
                                    <UserPlus size={16} /> Add Staff
                                </button>
                            </div>
                            <Table columns={columns} data={staff} />
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
                                {tenantRoles.map(role => (
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
                                            {role.permissions.length === 0 && <span className="text-xs text-text-secondary">No permissions assigned.</span>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {isModalOpen && <StaffFormModal staff={editingStaff} onSave={handleSave} onClose={() => setIsModalOpen(false)} />}
            {isRoleModalOpen && (
                <TenantRoleModal
                    role={editingRole}
                    onSave={handleSaveRole}
                    onClose={() => setIsRoleModalOpen(false)}
                    permissionLabels={permissionLabels}
                />
            )}
        </div>
    );
};

export default StaffManagementPage;