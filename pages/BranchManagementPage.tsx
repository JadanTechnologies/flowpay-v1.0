import React, { useState, useMemo } from 'react';
import { Store, PlusCircle, MoreVertical, Edit, Trash2 } from 'lucide-react';
import { Branch, Staff } from '../types';
import Table, { Column } from '../components/ui/Table';
import Modal from '../components/ui/Modal';
import { branches as mockBranches, staff as mockStaff } from '../data/mockData';
import { useAppContext } from '../contexts/AppContext';

interface BranchFormModalProps {
    branch: Branch | null;
    onSave: (branch: Branch) => void;
    onClose: () => void;
    allStaff: Staff[];
}

const BranchFormModal: React.FC<BranchFormModalProps> = ({ branch, onSave, onClose, allStaff }) => {
    const { tenantRoles } = useAppContext();
    const [formData, setFormData] = useState<Omit<Branch, 'id'>>(branch || { name: '', address: '', phone: '', managerIds: [], status: 'active' });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleManagerChange = (staffId: string, checked: boolean) => {
        setFormData(prev => {
            const currentManagerIds = prev.managerIds || [];
            if (checked) {
                return { ...prev, managerIds: [...currentManagerIds, staffId] };
            } else {
                return { ...prev, managerIds: currentManagerIds.filter(id => id !== staffId) };
            }
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ ...formData, id: branch?.id || '' });
    };
    
    const potentialManagers = useMemo(() => allStaff.filter(s => {
        const role = tenantRoles.find(r => r.id === s.roleId);
        return role && (role.name === 'Manager' || role.name === 'Admin');
    }), [allStaff, tenantRoles]);

    return (
        <Modal title={branch ? 'Edit Branch' : 'Add New Branch'} onClose={onClose}>
            <form onSubmit={handleSubmit}>
                <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                    <input type="text" name="name" placeholder="Branch Name" value={formData.name} onChange={handleChange} required className="w-full bg-background border border-border rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary text-sm" />
                    <input type="text" name="address" placeholder="Address" value={formData.address} onChange={handleChange} required className="w-full bg-background border border-border rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary text-sm" />
                    <input type="text" name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} className="w-full bg-background border border-border rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary text-sm" />
                    
                    <div>
                        <label className="text-sm text-text-secondary block mb-2">Assign Manager(s)</label>
                        <div className="max-h-40 overflow-y-auto bg-background p-2 rounded-md border border-border">
                            {potentialManagers.map(staff => {
                                const staffRole = tenantRoles.find(r => r.id === staff.roleId);
                                return (
                                <div key={staff.id} className="flex items-center p-1">
                                    <input
                                        type="checkbox"
                                        id={`manager-${staff.id}`}
                                        checked={formData.managerIds.includes(staff.id)}
                                        onChange={e => handleManagerChange(staff.id, e.target.checked)}
                                        className="h-4 w-4 rounded border-gray-600 text-primary focus:ring-primary bg-surface"
                                    />
                                    <label htmlFor={`manager-${staff.id}`} className="ml-3 text-sm text-text-primary">
                                        {staff.name} <span className="text-text-secondary">({staffRole?.name || 'Unknown'})</span>
                                    </label>
                                </div>
                            )})}
                        </div>
                    </div>

                    <select name="status" value={formData.status} onChange={handleChange} className="w-full bg-background border border-border rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary text-sm">
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                </div>
                <div className="p-4 bg-background rounded-b-xl flex justify-end gap-2">
                    <button type="button" onClick={onClose} className="bg-border hover:bg-border/70 text-text-primary font-semibold py-2 px-4 rounded-lg text-sm">Cancel</button>
                    <button type="submit" className="bg-primary hover:bg-primary-dark text-white font-semibold py-2 px-4 rounded-lg text-sm">Save Branch</button>
                </div>
            </form>
        </Modal>
    );
};

const BranchManagementPage: React.FC = () => {
    const [branches, setBranches] = useState<Branch[]>(mockBranches);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBranch, setEditingBranch] = useState<Branch | null>(null);

    const openModalForNew = () => {
        setEditingBranch(null);
        setIsModalOpen(true);
    };

    const openModalForEdit = (branch: Branch) => {
        setEditingBranch(branch);
        setIsModalOpen(true);
    };

    const handleDelete = (id: string) => {
        if (window.confirm('Are you sure you want to delete this branch?')) {
            setBranches(branches.filter(b => b.id !== id));
        }
    };
    
    const handleSave = (branch: Branch) => {
        if (editingBranch) {
            setBranches(branches.map(b => b.id === branch.id ? branch : b));
        } else {
            const newBranch = { ...branch, id: `br_${new Date().getTime()}` };
            setBranches([newBranch, ...branches]);
        }
        setIsModalOpen(false);
    };

    const columns: Column<Branch>[] = [
        { header: 'Branch Name', accessor: 'name', sortable: true },
        { header: 'Address', accessor: 'address', sortable: true },
        { header: 'Phone', accessor: 'phone' },
        { 
            header: 'Manager(s)', 
            accessor: 'managerIds', 
            render: (row) => (
                <div className="flex flex-col">
                    {row.managerIds.length > 0 ? row.managerIds.map(id => {
                        const manager = mockStaff.find(s => s.id === id);
                        return <span key={id} className="text-text-primary text-xs">{manager ? manager.name : 'Unknown'}</span>
                    }) : <span className="text-text-secondary text-xs">Unassigned</span>}
                </div>
            )
        },
        {
            header: 'Status',
            accessor: 'status',
            sortable: true,
            render: (row) => (
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${row.status === 'active' ? 'text-green-300 bg-green-900' : 'text-gray-300 bg-gray-700'}`}>
                    {row.status === 'active' ? 'Active' : 'Inactive'}
                </span>
            )
        },
        {
            header: 'Actions',
            accessor: 'actions',
            render: (row) => (
                <div className="group relative text-right">
                    <button className="p-1.5 rounded-md hover:bg-border"><MoreVertical size={16} /></button>
                    <div className="absolute right-0 mt-1 w-32 bg-surface border border-border rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity invisible group-hover:visible z-10">
                        <button onClick={() => openModalForEdit(row)} className="w-full text-left flex items-center gap-2 px-3 py-2 text-sm text-text-secondary hover:bg-background"><Edit size={14} /> Edit</button>
                        <button onClick={() => handleDelete(row.id)} className="w-full text-left flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-background"><Trash2 size={14} /> Delete</button>
                    </div>
                </div>
            )
        }
    ];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-text-primary">Branch Management</h1>
                <button onClick={openModalForNew} className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-semibold py-2 px-4 rounded-lg transition-colors">
                    <PlusCircle size={16} /> Add Branch
                </button>
            </div>
            <div className="bg-surface border border-border rounded-xl p-6 shadow-lg">
                <Table columns={columns} data={branches} />
            </div>
            {isModalOpen && <BranchFormModal branch={editingBranch} onSave={handleSave} onClose={() => setIsModalOpen(false)} allStaff={mockStaff} />}
        </div>
    );
};
export default BranchManagementPage;