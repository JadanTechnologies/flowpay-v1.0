import React, { useState } from 'react';
import { Ban, PlusCircle, Trash2 } from 'lucide-react';
import { BlockRule } from '../../types';
import Table, { Column } from '../../components/ui/Table';
import Modal from '../../components/ui/Modal';
import { useAppContext } from '../../contexts/AppContext';
import ConfirmationModal from '../../components/ui/ConfirmationModal';

// Modal for adding/editing a block rule
const BlockRuleModal: React.FC<{
    onSave: (rule: Omit<BlockRule, 'id' | 'createdAt'>) => void;
    onClose: () => void;
}> = ({ onSave, onClose }) => {
    const [type, setType] = useState<'ip' | 'country' | 'region' | 'browser' | 'os' | 'device_type'>('ip');
    const [value, setValue] = useState('');
    const [reason, setReason] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!value.trim() || !reason.trim()) {
            alert('Value and Reason are required.');
            return;
        }
        onSave({ type, value, reason });
    };

    return (
        <Modal title="Add New Block Rule" onClose={onClose}>
            <form onSubmit={handleSubmit}>
                <div className="p-6 space-y-4">
                    <div>
                        <label className="text-sm text-text-secondary block mb-1">Block Type</label>
                        <select value={type} onChange={e => setType(e.target.value as any)} className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm">
                            <option value="ip">IP Address</option>
                            <option value="country">Country</option>
                            <option value="region">Region/State</option>
                            <option value="browser">Browser</option>
                            <option value="os">Operating System</option>
                            <option value="device_type">Device Type</option>
                        </select>
                    </div>
                    <div>
                        <label className="text-sm text-text-secondary block mb-1">Value to Block</label>
                        <input type="text" value={value} onChange={e => setValue(e.target.value)} required className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm" placeholder={type === 'ip' ? 'e.g., 123.45.67.89' : 'e.g., North Korea'} />
                    </div>
                    <div>
                        <label className="text-sm text-text-secondary block mb-1">Reason</label>
                        <input type="text" value={reason} onChange={e => setReason(e.target.value)} required className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm" placeholder="e.g., Spam activity detected"/>
                    </div>
                </div>
                <div className="p-4 bg-background rounded-b-xl flex justify-end gap-2">
                    <button type="button" onClick={onClose} className="bg-border hover:bg-border/70 text-text-primary font-semibold py-2 px-4 rounded-lg text-sm">Cancel</button>
                    <button type="submit" className="bg-primary hover:bg-primary-dark text-white font-semibold py-2 px-4 rounded-lg text-sm">Add Rule</button>
                </div>
            </form>
        </Modal>
    );
};


const SuperAdminAccessControlPage: React.FC = () => {
    const { blockRules, setBlockRules, addNotification } = useAppContext();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [ruleToDelete, setRuleToDelete] = useState<BlockRule | null>(null);

    const handleAddRule = (rule: Omit<BlockRule, 'id' | 'createdAt'>) => {
        const newRule: BlockRule = {
            ...rule,
            id: `br_${Date.now()}`,
            createdAt: new Date().toISOString(),
        };
        setBlockRules(prev => [newRule, ...prev]);
        setIsModalOpen(false);
        addNotification({ message: 'Block rule added successfully.', type: 'success' });
    };

    const handleDelete = (rule: BlockRule) => {
        setRuleToDelete(rule);
    };

    const confirmDelete = () => {
        if (ruleToDelete) {
            setBlockRules(prev => prev.filter(r => r.id !== ruleToDelete.id));
            addNotification({ message: `Rule for "${ruleToDelete.value}" deleted.`, type: 'info' });
            setRuleToDelete(null);
        }
    };

    const columns: Column<BlockRule>[] = [
        { header: 'Type', accessor: 'type', sortable: true, render: (row) => <span className="capitalize">{row.type.replace('_', ' ')}</span> },
        { header: 'Value', accessor: 'value', sortable: true },
        { header: 'Reason', accessor: 'reason' },
        { header: 'Blocked On', accessor: 'createdAt', sortable: true, render: (row) => new Date(row.createdAt).toLocaleString() },
        {
            header: 'Actions',
            accessor: 'actions',
            render: (row) => (
                <button onClick={() => handleDelete(row)} className="p-1.5 hover:bg-border rounded-md">
                    <Trash2 size={14} className="text-red-400" />
                </button>
            ),
        }
    ];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-text-primary">Platform Access Control</h1>
                <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-semibold py-2 px-4 rounded-lg transition-colors">
                    <PlusCircle size={16} /> Add Block Rule
                </button>
            </div>
            <div className="bg-surface border border-border rounded-xl p-6 shadow-lg">
                <h2 className="text-xl font-semibold text-text-primary mb-4">Block Rules ({blockRules.length})</h2>
                <p className="text-sm text-text-secondary mb-4">
                    These rules apply globally to all tenants. Use with caution as this can block legitimate users.
                </p>
                <Table columns={columns} data={blockRules} />
            </div>

            {isModalOpen && (
                <BlockRuleModal onSave={handleAddRule} onClose={() => setIsModalOpen(false)} />
            )}
            
            <ConfirmationModal
                isOpen={!!ruleToDelete}
                onClose={() => setRuleToDelete(null)}
                onConfirm={confirmDelete}
                title="Delete Block Rule"
                message={`Are you sure you want to permanently delete the block rule for "${ruleToDelete?.value}"? This action cannot be undone.`}
                confirmText="Delete"
            />
        </div>
    );
};

export default SuperAdminAccessControlPage;
