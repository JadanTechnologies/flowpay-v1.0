import React, { useState, useMemo } from 'react';
// FIX: The `react-router-dom` module seems to have CJS/ESM interop issues in this environment. Using a namespace import as a workaround.
import * as ReactRouterDOM from 'react-router-dom';
import { History, ArrowLeft, Store, Filter } from 'lucide-react';
import { InventoryAdjustmentLog, InventoryAdjustmentLogType } from '../../types';
import Table, { Column } from '../../components/ui/Table';
import { useAppContext } from '../../contexts/AppContext';

const logTypeLabels: Record<InventoryAdjustmentLogType, string> = {
    'Manual Adjustment': 'Manual',
    'Purchase Order Receipt': 'PO Receipt',
    'Sale Return': 'Return',
    'Stock Count': 'Count',
    'Stock Transfer In': 'Transfer In',
    'Stock Transfer Out': 'Transfer Out',
};

const logTypeColors: Record<InventoryAdjustmentLogType, string> = {
    'Manual Adjustment': 'bg-purple-900 text-purple-300',
    'Purchase Order Receipt': 'bg-green-900 text-green-300',
    'Sale Return': 'bg-blue-900 text-blue-300',
    'Stock Count': 'bg-yellow-900 text-yellow-300',
    'Stock Transfer In': 'bg-indigo-900 text-indigo-300',
    'Stock Transfer Out': 'bg-pink-900 text-pink-300',
};

const InventoryHistoryPage: React.FC = () => {
    const { inventoryAdjustmentLogs, branches, currentBranchId } = useAppContext();
    const [branchFilter, setBranchFilter] = useState<string>(currentBranchId);
    const [typeFilter, setTypeFilter] = useState<string>('all');

    const filteredLogs = useMemo(() => {
        return inventoryAdjustmentLogs
            .filter(log => branchFilter === 'all' || log.branchId === branchFilter)
            .filter(log => typeFilter === 'all' || log.type === typeFilter);
    }, [inventoryAdjustmentLogs, branchFilter, typeFilter]);
    
    const columns: Column<InventoryAdjustmentLog>[] = [
        {
            header: 'Timestamp',
            accessor: 'timestamp',
            sortable: true,
            render: (row) => new Date(row.timestamp).toLocaleString()
        },
        { 
            header: 'Type',
            accessor: 'type',
            render: (row) => (
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${logTypeColors[row.type]}`}>
                    {logTypeLabels[row.type]}
                </span>
            )
        },
        {
            header: 'Details',
            accessor: 'items',
            render: (row) => (
                <div className="text-xs space-y-1">
                    {row.items.map(item => (
                        <div key={item.productId} className="flex justify-between items-center">
                            <span>{item.productName}</span>
                            <span className={`font-mono font-semibold ${item.change > 0 ? 'text-green-400' : 'text-red-400'}`}>
                                {item.change > 0 ? `+${item.change}` : item.change}
                            </span>
                        </div>
                    ))}
                </div>
            )
        },
        { header: 'User', accessor: 'user' },
        { 
            header: 'Reference', 
            accessor: 'referenceId',
            render: (row) => row.referenceId ? <span className="font-mono text-xs">{row.referenceId}</span> : <span className="text-text-secondary">N/A</span>
        },
    ];
    
    return (
        <div className="space-y-6">
             <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                     <ReactRouterDOM.Link to="/app/inventory" className="p-2 rounded-md hover:bg-surface">
                        <ArrowLeft size={24} />
                    </ReactRouterDOM.Link>
                    <h1 className="text-3xl font-bold text-text-primary">Inventory History</h1>
                </div>
            </div>
            <div className="bg-surface border border-border rounded-xl p-6 shadow-lg">
                <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
                    <h2 className="text-xl font-semibold text-text-primary">Adjustment Log</h2>
                     <div className="flex items-center gap-4">
                        <div className="relative">
                            <Store className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" size={16} />
                            <select value={branchFilter} onChange={e => setBranchFilter(e.target.value)} className="w-full appearance-none pl-10 pr-4 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-sm">
                                <option value="all">All Branches</option>
                                {branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                            </select>
                        </div>
                        <div className="relative">
                            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" size={16} />
                            <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="w-full appearance-none pl-10 pr-4 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-sm">
                                <option value="all">All Types</option>
                                {Object.keys(logTypeLabels).map(type => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
                <Table columns={columns} data={filteredLogs} />
            </div>
        </div>
    );
};

export default InventoryHistoryPage;