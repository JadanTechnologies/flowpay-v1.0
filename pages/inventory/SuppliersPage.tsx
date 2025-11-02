import React, { useState } from 'react';
// FIX: The `react-router-dom` module seems to have CJS/ESM interop issues in this environment. Using a namespace import as a workaround.
import * as ReactRouterDOM from 'react-router-dom';
const { Link } = ReactRouterDOM;
import { UserSquare, PlusCircle, MoreVertical, Edit, Trash2, ArrowLeft } from 'lucide-react';
import { Supplier } from '../../types';
import Table, { Column } from '../../components/ui/Table';
import { useAppContext } from '../../contexts/AppContext';
import SupplierModal from '../../components/inventory/SupplierModal';

const SuppliersPage: React.FC = () => {
    const { suppliers, setSuppliers } = useAppContext();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);

    const openModalForNew = () => {
        setEditingSupplier(null);
        setIsModalOpen(true);
    };

    const openModalForEdit = (supplier: Supplier) => {
        setEditingSupplier(supplier);
        setIsModalOpen(true);
    };
    
    const handleSave = (supplier: Supplier) => {
        if (editingSupplier) {
            setSuppliers(prev => prev.map(s => s.id === supplier.id ? supplier : s));
        } else {
            const newSupplier = { ...supplier, id: `sup_${new Date().getTime()}` };
            setSuppliers(prev => [newSupplier, ...prev]);
        }
        setIsModalOpen(false);
    };

    const handleDelete = (id: string) => {
        if (window.confirm('Are you sure you want to delete this supplier?')) {
            setSuppliers(prev => prev.filter(s => s.id !== id));
        }
    };

    const columns: Column<Supplier>[] = [
        { header: 'Supplier Name', accessor: 'name', sortable: true },
        { header: 'Contact Person', accessor: 'contactPerson' },
        { header: 'Email', accessor: 'email' },
        { header: 'Phone', accessor: 'phone' },
        { header: 'Payment Terms', accessor: 'paymentTerms', sortable: true },
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
                <div className="flex items-center gap-4">
                     <Link to="/app/inventory" className="p-2 rounded-md hover:bg-surface">
                        <ArrowLeft size={24} />
                    </Link>
                    <h1 className="text-3xl font-bold text-text-primary">Supplier Management</h1>
                </div>
                <button onClick={openModalForNew} className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-semibold py-2 px-4 rounded-lg transition-colors">
                    <PlusCircle size={16} /> Add Supplier
                </button>
            </div>
            <div className="bg-surface border border-border rounded-xl p-6 shadow-lg">
                 <Table columns={columns} data={suppliers} />
            </div>
            {isModalOpen && (
                <SupplierModal
                    supplier={editingSupplier}
                    onSave={handleSave}
                    onClose={() => setIsModalOpen(false)}
                />
            )}
        </div>
    );
};

export default SuppliersPage;