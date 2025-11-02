import React, { useState } from 'react';
import { CronJob } from '../../types';
import { cronJobs as mockCronJobs } from '../../data/mockData';
import Table, { Column } from '../../components/ui/Table';
import { Clock, PlayCircle } from 'lucide-react';

const getStatusBadge = (status: CronJob['status']) => {
    switch (status) {
        case 'OK': return <span className="px-2 py-1 text-xs font-medium text-green-300 bg-green-900 rounded-full">{status}</span>;
        case 'Failed': return <span className="px-2 py-1 text-xs font-medium text-red-300 bg-red-900 rounded-full">{status}</span>;
        case 'Running': return <span className="px-2 py-1 text-xs font-medium text-blue-300 bg-blue-900 rounded-full flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-blue-300 animate-pulse"></div>{status}</span>;
    }
};

const CronJobsPage: React.FC = () => {
    const [jobs, setJobs] = useState<CronJob[]>(mockCronJobs);

    const columns: Column<CronJob>[] = [
        {
            header: 'Job',
            accessor: 'name',
            sortable: true,
            render: (row) => (
                <div>
                    <div className="font-medium text-text-primary">{row.name}</div>
                    <div className="text-sm text-text-secondary">{row.description}</div>
                </div>
            )
        },
        { header: 'Schedule', accessor: 'schedule', render: (row) => <span className="font-mono text-xs">{row.schedule}</span> },
        { header: 'Last Run', accessor: 'lastRun', sortable: true },
        { header: 'Next Run', accessor: 'nextRun', sortable: true },
        { header: 'Status', accessor: 'status', render: (row) => getStatusBadge(row.status) },
        {
            header: 'Actions',
            accessor: 'actions',
            render: (row) => (
                <button 
                    onClick={() => alert(`Manually triggering job: ${row.name}`)}
                    className="flex items-center gap-1 text-xs bg-primary/20 text-primary font-semibold py-1 px-2 rounded-lg hover:bg-primary/40 transition-colors"
                >
                    <PlayCircle size={14} /> Run Now
                </button>
            )
        }
    ];

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-text-primary">Cron Job Status</h1>
            
            <div className="bg-surface border border-border rounded-xl p-6 shadow-lg">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-text-primary">Automated Tasks</h2>
                </div>
                <Table columns={columns} data={jobs} />
            </div>
        </div>
    );
};

export default CronJobsPage;