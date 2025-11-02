



import React, { useState, useMemo, useEffect } from 'react';
// FIX: The `react-router-dom` module seems to have CJS/ESM interop issues in this environment. Using a namespace import as a workaround.
import { useNavigate } from 'react-router-dom';
import { Users, UserPlus, Search, MoreVertical, Edit, Trash2, ShieldOff, Shield, Loader, History } from 'lucide-react';
import { Tenant } from '../../types';
import Table, { Column } from '../../components/ui/Table';
import Modal from '../../components/ui/Modal';
import { tenants as mockTenants } from '../../data/mockData';

const TenantsPage: React.FC = () => {
    const navigate = useNavigate();
    const [tenants, setTenants] = useState<Tenant[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newTenant, setNewTenant] = useState({ companyName: '', email: '', plan: 'Basic' });

    const fetchTenants = async () => {
        setLoading(true);
        setError(null);
        try {
            await new Promise(resolve => setTimeout(resolve, 500));
            setTenants(mockTenants);
        } catch (err: any) {
            setError('Failed to fetch tenants.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTenants();
    }, []);

    const filteredTenants = useMemo(() =>
        tenants.filter(tenant =>
            tenant.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            tenant.email.toLowerCase().includes(searchTerm.toLowerCase())
        ), [tenants, searchTerm]
    );

    const handleSuspendToggle = async (tenant: Tenant) => {
        const { id, companyName, status } = tenant;
        const newStatus = status === 'active' ? 'suspended' : 'active';
        const action = status === 'active' ? 'suspend' : 'activate';
        const actionPastTense = status === 'active' ? 'suspended' : 'activated';

        if (window.confirm(`Are you sure you want to ${action} the tenant "${companyName}"?`)) {
            setTenants(tenants.map(t => (t.id === id ? { ...t, status: newStatus } : t)));
            alert(`Tenant "${companyName}" has been successfully ${actionPastTense}.`);
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this tenant? This action cannot be undone.')) {
            setTenants(tenants.filter(t => t.id !== id));
        }
    };

    const handleAddTenant = async (e: React.FormEvent) => {
        e.preventDefault();
        const mockNewTenant: Tenant = {
            id: `tnt_${new Date().getTime()}`,
            companyName: newTenant.companyName,
            email: newTenant.email,
            plan: newTenant.plan,
            status: 'active',
            joinedDate: new Date().toLocaleDateString()
        };
        setTenants([mockNewTenant, ...tenants]);
        
        setIsModalOpen(false);
        setNewTenant({ companyName: '', email: '', plan: 'Basic' });
    };

    const columns: Column<Tenant>[] = [
        {
            header: 'Company Name',
            accessor: 'companyName',
            sortable: true,
            render: (row: Tenant) => (
                <div>
                    <div className="font-medium text-text-primary">{row.companyName}</div>
                    <div className="text-sm text-text-secondary">{row.email}</div>
                </div>
            )
        },
        {
            header: 'Status',
            accessor: 'status',
            sortable: true,
            render: (row: Tenant) => (
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    row.status === 'active'
                        ? 'text-green-300 bg-green-900'
                        : 'text-yellow-300 bg-yellow-900'
                }`}>
                    {row.status}
                </span>
            )
        },
        {
            header: 'Plan',
            accessor: 'plan',
            sortable: true,
        },
        {
            header: 'Subscription Expires',
            accessor: 'subscriptionExpires' as any,
            sortable: true,
            render: (row: Tenant) => {
                if (!row.subscriptionExpires) {
                    return <span className="text-text-secondary">N/A</span>;
                }
                const expiryDate = new Date(row.subscriptionExpires);
                const now = new Date();
                const diffTime = expiryDate.getTime() - now.getTime();
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                let color = 'text-text-primary';
                if (diffDays <= 0) {
                    color = 'text-red-400';
                } else if (diffDays <= 7) {
                    color = 'text-yellow-400';
                }

                return (
                    <div className={color}>
                        <div>{expiryDate.toLocaleDateString()}</div>
                        <div className="text-xs">{diffDays > 0 ? `in ${diffDays} days` : `expired ${-diffDays} days ago`}</div>
                    </div>
                );
            }
        },
        {
            header: 'Joined Date',
            accessor: 'joinedDate',
            sortable: true,
        },
        {
            header: 'Actions',
            accessor: 'actions',
            render: (row: Tenant) => (
                 <div className="group relative">
                    <button className="p-1.5 rounded-md hover:bg-border"><MoreVertical size={16}/></button>
                    <div className="absolute right-0 mt-1 w-48 bg-surface border border-border rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity invisible group-hover:visible z-10">
                        <button onClick={() => navigate(`/admin/tenants/${row.id}/activity`)} className="w-full text-left flex items-center gap-2 px-3 py-2 text-sm text-text-secondary hover:bg-background">
                            <History size={14} /> Activity Log
                        </button>
                        <button className="w-full text-left flex items-center gap-2 px-3 py-2 text-sm text-text-secondary hover:bg-background">
                            <Edit size={14} /> Edit
                        </button>
                        <button onClick={() => handleSuspendToggle(row)} className="w-full text-left flex items-center gap-2 px-3 py-2 text-sm text-text-secondary hover:bg-background">
                           {row.status === 'active' ? <><ShieldOff size={14} /> Suspend</> : <><Shield size={14} /> Activate</>}
                        </button>
                        <hr className="border-border"/>
                        <button onClick={() => handleDelete(row.id)} className="w-full text-left flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-background">
                            <Trash2 size={14} /> Delete
                        </button>
                    </div>
                </div>
            )
        }
    ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-text-primary">Tenant Management</h1>
         <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-semibold py-2 px-4 rounded-lg transition-colors">
            <UserPlus size={16} /> Add Tenant
        </button>
      </div>
      
      <div className="bg-surface border border-border rounded-xl p-6 shadow-lg">
         <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-text-primary">All Tenants ({tenants.length})</h2>
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" size={18} />
                <input
                    type="text"
                    placeholder="Search tenants..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="bg-background border border-border rounded-lg pl-10 pr-4 py-2 w-64 focus:outline-none focus:ring-1 focus:ring-primary text-sm"
                />
            </div>
         </div>
         {loading ? (
             <div className="flex justify-center items-center h-64"><Loader className="animate-spin text-primary" size={40}/></div>
         ) : error ? (
             <div className="flex justify-center items-center h-64 text-red-400">{error}</div>
         ) : (
            <Table columns={columns} data={filteredTenants} />
         )}
      </div>

       {isModalOpen && (
        <Modal title="Add New Tenant" onClose={() => setIsModalOpen(false)}>
            <form onSubmit={handleAddTenant}>
                <div className="space-y-4 p-6">
                    <div>
                        <label className="text-sm text-text-secondary block mb-1">Company Name</label>
                        <input type="text" value={newTenant.companyName} onChange={e => setNewTenant({...newTenant, companyName: e.target.value})} required className="w-full bg-background border border-border rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary text-sm" />
                    </div>
                     <div>
                        <label className="text-sm text-text-secondary block mb-1">Email Address</label>
                        <input type="email" value={newTenant.email} onChange={e => setNewTenant({...newTenant, email: e.target.value})} required className="w-full bg-background border border-border rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary text-sm" />
                    </div>
                     <div>
                        <label className="text-sm text-text-secondary block mb-1">Subscription Plan</label>
                        <select value={newTenant.plan} onChange={e => setNewTenant({...newTenant, plan: e.target.value})} required className="w-full bg-background border border-border rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary text-sm appearance-none p-2">
                            <option>Basic</option>
                            <option>Pro</option>
                            <option>Premium</option>
                        </select>
                    </div>
                </div>
                <div className="p-4 bg-background rounded-b-xl flex justify-end gap-2">
                    <button type="button" onClick={() => setIsModalOpen(false)} className="bg-border hover:bg-border/70 text-text-primary font-semibold py-2 px-4 rounded-lg text-sm">Cancel</button>
                    <button type="submit" className="bg-primary hover:bg-primary-dark text-white font-semibold py-2 px-4 rounded-lg text-sm">Create Tenant</button>
                </div>
            </form>
        </Modal>
       )}

    </div>
  );
};

export default TenantsPage;