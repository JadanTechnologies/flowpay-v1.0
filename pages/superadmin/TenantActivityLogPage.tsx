import React, { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ActivityLog } from '../../types';
import { activityLogs as mockLogs, tenants as mockTenants } from '../../data/mockData';
import Table, { Column } from '../../components/ui/Table';
import { ArrowLeft } from 'lucide-react';

const TenantActivityLogPage: React.FC = () => {
    const { tenantId } = useParams<{ tenantId: string }>();
    
    const tenant = useMemo(() => mockTenants.find(t => t.id === tenantId), [tenantId]);
    
    const filteredLogs = useMemo(() => {
        return mockLogs.filter(log => log.tenantId === tenantId);
    }, [tenantId]);
    
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
    
    if (!tenant) {
        return <div className="text-red-400">Tenant not found.</div>;
    }
    
    return (
        <div className="space-y-6">
             <div className="flex items-center gap-4">
                <Link to="/admin/tenants" className="p-2 rounded-md hover:bg-surface">
                    <ArrowLeft size={24} />
                </Link>
                <div>
                    <h1 className="text-3xl font-bold text-text-primary">Activity Log</h1>
                    <p className="text-text-secondary">Viewing all activity for <span className="font-semibold text-primary">{tenant.companyName}</span></p>
                </div>
            </div>

            <div className="bg-surface border border-border rounded-xl p-6 shadow-lg">
                <Table columns={columns} data={filteredLogs} />
                 {filteredLogs.length === 0 && (
                    <div className="text-center py-12 text-text-secondary">
                        No activity recorded for this tenant yet.
                    </div>
                )}
            </div>
        </div>
    );
};

export default TenantActivityLogPage;