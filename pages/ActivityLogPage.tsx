import React, { useState, useMemo } from 'react';
import { ActivityLog, Staff } from '../../types';
import { activityLogs as mockLogs, staff as mockStaff } from '../../data/mockData';
import Table, { Column } from '../../components/ui/Table';

const ActivityLogPage: React.FC = () => {
    const [logs, setLogs] = useState<ActivityLog[]>(mockLogs);
    const [roleFilter, setRoleFilter] = useState<string>('all');
    const [branchFilter, setBranchFilter] = useState<string>('all');
    
    const branches = useMemo(() => [...new Set(logs.map(l => l.branch))], [logs]);

    const filteredLogs = useMemo(() => {
        return logs
            .filter(log => roleFilter === 'all' || log.userRole === roleFilter)
            .filter(log => branchFilter === 'all' || log.branch === branchFilter);
    }, [logs, roleFilter, branchFilter]);
    
    const columns: Column<ActivityLog>[] = [
        {
            header: 'Timestamp',
            accessor: 'timestamp',
            sortable: true,
            render: (row) => new Date(row.timestamp).toLocaleString()
        },
        {
            header: 'User',
            accessor: 'user',
            sortable: true,
            render: (row) => (
                <div>
                    <div className="font-medium text-text-primary">{row.user}</div>
                    <div className="text-sm text-text-secondary">{row.userRole}</div>
                </div>
            )
        },
        { header: 'Branch', accessor: 'branch', sortable: true },
        { header: 'Action', accessor: 'action', sortable: true },
        { header: 'Details', accessor: 'details' },
    ];
    
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-text-primary">Activity Log</h1>
            <div className="bg-surface border border-border rounded-xl p-6 shadow-lg">
                <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
                    <h2 className="text-xl font-semibold text-text-primary">Recent Actions</h2>
                    <div className="flex items-center gap-4">
                        <select
                            value={roleFilter}
                            onChange={(e) => setRoleFilter(e.target.value)}
                            className="bg-background border border-border rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary text-sm"
                        >
                            <option value="all">All Roles</option>
                            <option value="Admin">Admin</option>
                            <option value="Manager">Manager</option>
                            <option value="Cashier">Cashier</option>
                        </select>
                         <select
                            value={branchFilter}
                            onChange={(e) => setBranchFilter(e.target.value)}
                            className="bg-background border border-border rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary text-sm"
                        >
                            <option value="all">All Branches</option>
                            {branches.map(b => <option key={b} value={b}>{b}</option>)}
                        </select>
                    </div>
                </div>
                <Table columns={columns} data={filteredLogs} />
            </div>
        </div>
    );
};

export default ActivityLogPage;