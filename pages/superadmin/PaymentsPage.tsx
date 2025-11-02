import React, { useState, useMemo } from 'react';
import { PlatformPayment } from '../../types';
import { platformPayments as mockPayments } from '../../data/mockData';
import Table, { Column } from '../../components/ui/Table';
import { DollarSign, Search } from 'lucide-react';
import { formatCurrency } from '../../utils/formatting';

const getStatusBadge = (status: PlatformPayment['status']) => {
    switch (status) {
        case 'Success': return <span className="px-2 py-1 text-xs font-medium text-green-300 bg-green-900 rounded-full">{status}</span>;
        case 'Failed': return <span className="px-2 py-1 text-xs font-medium text-red-300 bg-red-900 rounded-full">{status}</span>;
        case 'Refunded': return <span className="px-2 py-1 text-xs font-medium text-gray-300 bg-gray-700 rounded-full">{status}</span>;
    }
};

const PaymentsPage: React.FC = () => {
    const [payments, setPayments] = useState<PlatformPayment[]>(mockPayments);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredPayments = useMemo(() =>
        payments.filter(payment =>
            payment.tenantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            payment.transactionId.toLowerCase().includes(searchTerm.toLowerCase())
        ), [payments, searchTerm]
    );

    const columns: Column<PlatformPayment>[] = [
        {
            header: 'Tenant',
            accessor: 'tenantName',
            sortable: true,
            render: (row) => (
                <div>
                    <div className="font-medium text-text-primary">{row.tenantName}</div>
                    <div className="text-sm text-text-secondary">{row.tenantId}</div>
                </div>
            )
        },
        { header: 'Plan', accessor: 'plan', sortable: true },
        { header: 'Gateway', accessor: 'gateway', sortable: true, render: (row) => <span className="capitalize">{row.gateway}</span> },
        { header: 'Status', accessor: 'status', sortable: true, render: (row) => getStatusBadge(row.status) },
        { header: 'Date', accessor: 'date', sortable: true },
        { header: 'Amount', accessor: 'amount', sortable: true, render: (row) => formatCurrency(row.amount, 'USD') },
        { header: 'Transaction ID', accessor: 'transactionId', render: (row) => <span className="font-mono text-xs">{row.transactionId}</span> },
    ];

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-text-primary">Payment Management</h1>
            
            <div className="bg-surface border border-border rounded-xl p-6 shadow-lg">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-text-primary">All Transactions ({payments.length})</h2>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" size={18} />
                        <input
                            type="text"
                            placeholder="Search by tenant or TXN ID..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="bg-background border border-border rounded-lg pl-10 pr-4 py-2 w-72 focus:outline-none focus:ring-1 focus:ring-primary text-sm"
                        />
                    </div>
                </div>
                <Table columns={columns} data={filteredPayments} />
            </div>
        </div>
    );
};

export default PaymentsPage;