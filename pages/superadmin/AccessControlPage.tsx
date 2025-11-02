import React, { useState } from 'react';
import { Ban, PlusCircle, MoreVertical, Edit, Trash2 } from 'lucide-react';
import { BlockRule } from '../../types';
import { useAppContext } from '../../contexts/AppContext';
import Table, { Column } from '../../components/ui/Table';
import Modal from '../../components/ui/Modal';

const AccessControlPage: React.FC = () => {
    const { blockRules, setBlockRules } = useAppContext();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRule, setEditingRule] = useState<BlockRule | null>(null);

    const openModalForNew = () => {
        setEditingRule(null);
        setIsModalOpen(true);
    };

    const handleSaveRule = (rule: BlockRule) => {
        if (editingRule) {
            setBlockRules(prev => prev.map(r => r.id === rule.id ? rule : r));
        } else {
            const newRule = { ...rule, id: `br_${Date.now()}`, createdAt: new Date().toISOString() };
            setBlockRules(prev => [newRule, ...prev]);
        }
        setIsModalOpen(false);
    };

    const handleDeleteRule = (id: string) => {
        if (window.confirm('Are you sure you want to delete this block rule?')) {
            setBlockRules(prev => prev.filter(r => r.id !== id));
        }
    };

    const columns: Column<BlockRule>[] = [
        { header: 'Type', accessor: 'type', sortable: true, render: (row) => <span className="capitalize">{row.type.replace('_', ' ')}</span> },
        { header: 'Value', accessor: 'value', render: (row) => <code className="text-secondary">{row.value}</code> },
        { header: 'Reason', accessor: 'reason' },
        { header: 'Created At', accessor: 'createdAt', sortable: true, render: (row) => new Date(row.createdAt).toLocaleString() },
        {
            header: 'Actions',
            accessor: 'actions',
            render: (row) => (
                <button onClick={() => handleDeleteRule(row.id)} className="p-1.5 hover:bg-border rounded-md"><Trash2 size={14} className="text-red-400" /></button>
            )
        }
    ];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-text-primary">Platform Access Control</h1>
                <button onClick={openModalForNew} className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-semibold py-2 px-4 rounded-lg transition-colors">
                    <PlusCircle size={16} /> Add Block Rule
                </button>
            </div>
             <div className="bg-surface border border-border rounded-xl p-6 shadow-lg">
                <h2 className="text-xl font-semibold text-text-primary mb-4">Block Rules</h2>
                <p className="text-sm text-text-secondary mb-4">These rules block access to the entire platform for all tenants. Use with caution.</p>
                <Table columns={columns} data={blockRules} />
            </div>

            {isModalOpen && (
                <RuleFormModal
                    rule={editingRule}
                    onSave={handleSaveRule}
                    onClose={() => setIsModalOpen(false)}
                />
            )}
        </div>
    );
};


// Form Modal Sub-component
interface RuleFormModalProps {
    rule: BlockRule | null;
    onSave: (rule: BlockRule) => void;
    onClose: () => void;
}

const RuleFormModal: React.FC<RuleFormModalProps> = ({ rule, onSave, onClose }) => {
    const [formData, setFormData] = useState<Omit<BlockRule, 'id' | 'createdAt'>>(rule || {
        type: 'ip',
        value: '',
        reason: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.value || !formData.reason) {
            alert('Value and Reason are required.');
            return;
        }
        onSave({ ...formData, id: rule?.id || '', createdAt: rule?.createdAt || '' });
    };

    return (
        <Modal title={rule ? 'Edit Block Rule' : 'Create New Block Rule'} onClose={onClose}>
            <form onSubmit={handleSubmit}>
                <div className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm text-text-secondary block mb-1">Block Type</label>
                            <select name="type" value={formData.type} onChange={handleChange} className="w-full bg-background border border-border rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary text-sm">
                                <option value="ip">IP Address</option>
                                <option value="country">Country</option>
                                <option value="region">Region</option>
                                <option value="browser">Browser</option>
                                <option value="os">Operating System</option>
                                <option value="device_type">Device Type</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-sm text-text-secondary block mb-1">Value to Block</label>
                            <input type="text" name="value" placeholder="e.g., 123.45.67.89, China, Chrome" value={formData.value} onChange={handleChange} required className="w-full bg-background border border-border rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary text-sm" />
                        </div>
                    </div>
                     <div>
                        <label className="text-sm text-text-secondary block mb-1">Reason</label>
                        <textarea name="reason" value={formData.reason} onChange={handleChange} required rows={3} className="w-full bg-background border border-border rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary text-sm" />
                    </div>
                </div>
                <div className="p-4 bg-background rounded-b-xl flex justify-end gap-2">
                    <button type="button" onClick={onClose} className="bg-border hover:bg-border/70 text-text-primary font-semibold py-2 px-4 rounded-lg text-sm">Cancel</button>
                    <button type="submit" className="bg-primary hover:bg-primary-dark text-white font-semibold py-2 px-4 rounded-lg text-sm">Save Rule</button>
                </div>
            </form>
        </Modal>
    )
}

export default AccessControlPage;
