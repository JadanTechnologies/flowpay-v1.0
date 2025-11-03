import React, { useState } from 'react';
import { Receipt, PlusCircle, MoreVertical, Eye, CheckCircle, Trash2, DollarSign, Download, Repeat } from 'lucide-react';
import { Invoice } from '../../types';
import Table, { Column } from '../../components/ui/Table';
import DashboardCard from '../../components/dashboard/DashboardCard';
import Modal from '../../components/ui/Modal';
import { useAppContext } from '../../contexts/AppContext';
import { formatCurrency } from '../../utils/formatting';
import InvoiceViewModal from '../../components/invoicing/InvoiceViewModal';


const getStatusBadge = (status: Invoice['status']) => {
    switch (status) {
        case 'Paid': return <span className="px-2 py-1 text-xs font-medium text-green-300 bg-green-900 rounded-full">{status}</span>;
        case 'Due': return <span className="px-2 py-1 text-xs font-medium text-blue-300 bg-blue-900 rounded-full">{status}</span>;
        case 'Overdue': return <span className="px-2 py-1 text-xs font-medium text-red-300 bg-red-900 rounded-full">{status}</span>;
    }
};

const InvoicingPage: React.FC = () => {
    const { currency, scheduledJobs, setScheduledJobs, session, invoices, setInvoices } = useAppContext();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
    const [viewingInvoice, setViewingInvoice] = useState<Invoice | null>(null);

    const totalOutstanding = invoices.filter(i => i.status === 'Due' || i.status === 'Overdue').reduce((sum, i) => sum + i.amount, 0);
    const totalOverdue = invoices.filter(i => i.status === 'Overdue').reduce((sum, i) => sum + i.amount, 0);

    const openModalForNew = () => {
        setEditingInvoice(null);
        setIsModalOpen(true);
    };

    const handleSaveInvoice = (invoice: Invoice) => {
        let finalInvoice: Invoice;
        if (editingInvoice) {
            finalInvoice = { ...invoice };
            setInvoices(invoices.map(i => i.id === invoice.id ? invoice : i));
        } else {
            const newInvoice = { ...invoice, id: `inv_${new Date().getTime()}`};
            finalInvoice = newInvoice;
            setInvoices([newInvoice, ...invoices]);
        }

        const job_id = `job_inv_${finalInvoice.id}`;
        const existingJob = scheduledJobs.find(j => j.id === job_id);

        if (finalInvoice.isRecurring) {
            const issueDate = new Date(finalInvoice.issueDate);
            const dayOfMonth = issueDate.getUTCDate();
            const dayOfWeek = issueDate.getUTCDay();
            const month = issueDate.getUTCMonth() + 1;

            let cronSchedule = '';
            switch (finalInvoice.recurringFrequency) {
                case 'weekly':
                    cronSchedule = `0 9 * * ${dayOfWeek}`;
                    break;
                case 'monthly':
                    cronSchedule = `0 9 ${dayOfMonth} * *`;
                    break;
                case 'yearly':
                    cronSchedule = `0 9 ${dayOfMonth} ${month} *`;
                    break;
            }

            const jobData = {
                name: `Recurring invoice for ${finalInvoice.customerName}`,
                taskType: 'recurring_invoice' as const,
                schedule: cronSchedule,
                config: { sourceInvoiceId: finalInvoice.id },
                status: 'active' as const,
                // FIX: Access tenant_id from user's app_metadata
                tenantId: session?.user?.app_metadata?.tenant_id || '',
                lastRun: null,
                nextRun: 'Pending calculation',
            };

            if (existingJob) {
                setScheduledJobs(jobs => jobs.map(j => j.id === job_id ? { ...j, ...jobData, id: job_id } : j));
            } else {
                setScheduledJobs(jobs => [{ ...jobData, id: job_id }, ...jobs]);
            }
        } else if (existingJob) {
            setScheduledJobs(jobs => jobs.filter(j => j.id !== job_id));
        }

        setIsModalOpen(false);
    };

    const handleMarkAsPaid = (id: string) => {
        if (window.confirm('Mark this invoice as paid?')) {
            setInvoices(invoices.map(i => i.id === id ? { ...i, status: 'Paid' } : i));
        }
    };
    
    const handleDelete = (id: string) => {
        if (window.confirm('Are you sure you want to delete this invoice?')) {
            setInvoices(invoices.filter(i => i.id !== id));
            const job_id = `job_inv_${id}`;
            const existingJob = scheduledJobs.find(j => j.id === job_id);
            if(existingJob) {
                setScheduledJobs(jobs => jobs.filter(j => j.id !== job_id));
            }
        }
    };

    const handleExportCsv = () => {
        const headers = ['Invoice ID', 'Customer Name', 'Issue Date', 'Due Date', 'Amount', 'Status'];
        const csvRows = [headers.join(',')];

        invoices.forEach(invoice => {
            const row = [
                `"${invoice.id}"`,
                `"${invoice.customerName.replace(/"/g, '""')}"`,
                `"${invoice.issueDate}"`,
                `"${invoice.dueDate}"`,
                invoice.amount,
                `"${invoice.status}"`
            ].join(',');
            csvRows.push(row);
        });

        const csvString = csvRows.join('\n');
        const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', 'invoices.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const columns: Column<Invoice>[] = [
        { 
            header: 'Invoice ID', 
            accessor: 'id', 
            sortable: true, 
            render: (row) => (
                <div className="flex items-center gap-2">
                    <span className="font-mono text-text-secondary">{row.id}</span>
                    {row.isRecurring && <span title={`Recurring ${row.recurringFrequency}`}><Repeat size={12} className="text-blue-400" /></span>}
                </div>
            )
        },
        { header: 'Customer', accessor: 'customerName', sortable: true },
        { header: 'Issue Date', accessor: 'issueDate', sortable: true },
        { header: 'Due Date', accessor: 'dueDate', sortable: true },
        { header: 'Status', accessor: 'status', sortable: true, render: (row) => getStatusBadge(row.status) },
        { header: 'Amount', accessor: 'amount', sortable: true, render: (row) => <div className="text-right font-medium text-text-primary">{formatCurrency(row.amount, currency)}</div> },
        {
            header: 'Actions',
            accessor: 'actions',
            render: (row) => (
                <div className="group relative text-right">
                    <button className="p-1.5 rounded-md hover:bg-border"><MoreVertical size={16} /></button>
                    <div className="absolute right-0 mt-1 w-40 bg-surface border border-border rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity invisible group-hover:visible z-10">
                        <button onClick={() => setViewingInvoice(row)} className="w-full text-left flex items-center gap-2 px-3 py-2 text-sm text-text-secondary hover:bg-background"><Eye size={14} /> View Invoice</button>
                        {row.status !== 'Paid' && <button onClick={() => handleMarkAsPaid(row.id)} className="w-full text-left flex items-center gap-2 px-3 py-2 text-sm text-text-secondary hover:bg-background"><CheckCircle size={14} /> Mark as Paid</button>}
                        <button onClick={() => handleDelete(row.id)} className="w-full text-left flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-background"><Trash2 size={14} /> Delete</button>
                    </div>
                </div>
            )
        }
    ];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-text-primary">Invoicing</h1>
                <div className="flex items-center gap-2">
                    <button onClick={handleExportCsv} className="flex items-center gap-2 bg-surface hover:bg-border text-text-secondary font-semibold py-2 px-4 rounded-lg transition-colors border border-border">
                        <Download size={16} /> Export CSV
                    </button>
                    <button onClick={openModalForNew} className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-semibold py-2 px-4 rounded-lg transition-colors">
                        <PlusCircle size={16} /> Create Invoice
                    </button>
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <DashboardCard title="Total Outstanding" value={formatCurrency(totalOutstanding, currency)} change={`${invoices.filter(i => i.status !== 'Paid').length} unpaid invoices`} icon={<DollarSign className="text-blue-500" />} />
                <DashboardCard title="Total Overdue" value={formatCurrency(totalOverdue, currency)} change={`${invoices.filter(i => i.status === 'Overdue').length} overdue invoices`} icon={<DollarSign className="text-red-500" />} />
            </div>

            <div className="bg-surface border border-border rounded-xl p-6 shadow-lg">
                <h2 className="text-xl font-semibold text-text-primary mb-4">All Invoices</h2>
                <Table columns={columns} data={invoices} />
            </div>

            {isModalOpen && <InvoiceFormModal invoice={editingInvoice} onSave={handleSaveInvoice} onClose={() => setIsModalOpen(false)} />}
            
            {viewingInvoice && (
                <InvoiceViewModal 
                    invoice={viewingInvoice}
                    onClose={() => setViewingInvoice(null)}
                />
            )}
        </div>
    );
};


const InvoiceFormModal: React.FC<{ invoice: Invoice | null; onSave: (invoice: Invoice) => void; onClose: () => void; }> = ({ invoice, onSave, onClose }) => {
    const [formData, setFormData] = useState<Omit<Invoice, 'id'>>({
        customerName: invoice?.customerName || '',
        issueDate: invoice?.issueDate || new Date().toISOString().split('T')[0],
        dueDate: invoice?.dueDate || '',
        amount: invoice?.amount || 0,
        status: invoice?.status || 'Due',
        isRecurring: invoice?.isRecurring || false,
        recurringFrequency: invoice?.recurringFrequency || 'monthly',
        recurringEndDate: invoice?.recurringEndDate || '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        
        if (type === 'checkbox') {
            const { checked } = e.target as HTMLInputElement;
            setFormData(prev => ({...prev, [name]: checked }));
            return;
        }

        setFormData(prev => ({...prev, [name]: type === 'number' ? parseFloat(value) : value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ ...formData, id: invoice?.id || '' });
    };

    return (
        <Modal title={invoice ? 'Edit Invoice' : 'Create New Invoice'} onClose={onClose}>
            <form onSubmit={handleSubmit}>
                <div className="p-6 space-y-4">
                     <input type="text" name="customerName" placeholder="Customer Name" value={formData.customerName} onChange={handleChange} required className="w-full bg-background border border-border rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary text-sm" />
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                             <label className="text-xs text-text-secondary block mb-1">Issue Date</label>
                            <input type="date" name="issueDate" value={formData.issueDate} onChange={handleChange} required className="w-full bg-background border border-border rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary text-sm" />
                        </div>
                        <div>
                             <label className="text-xs text-text-secondary block mb-1">Due Date</label>
                            <input type="date" name="dueDate" value={formData.dueDate} onChange={handleChange} required className="w-full bg-background border border-border rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary text-sm" />
                        </div>
                    </div>
                     <input type="number" name="amount" placeholder="Amount" value={formData.amount} onChange={handleChange} required step="0.01" className="w-full bg-background border border-border rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary text-sm" />
                    
                    <div className="pt-4 border-t border-border">
                        <div className="flex items-center gap-2">
                            <input type="checkbox" id="isRecurring" name="isRecurring" checked={formData.isRecurring} onChange={handleChange} className="h-4 w-4 rounded border-gray-600 text-primary focus:ring-primary bg-surface"/>
                            <label htmlFor="isRecurring" className="text-sm font-medium">Set as Recurring Invoice</label>
                        </div>

                        {formData.isRecurring && (
                            <div className="grid grid-cols-2 gap-4 mt-4 p-3 bg-background rounded-lg border border-border">
                                <div>
                                    <label className="text-xs text-text-secondary block mb-1">Frequency</label>
                                    <select name="recurringFrequency" value={formData.recurringFrequency} onChange={handleChange} className="w-full bg-background border border-border rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary text-sm">
                                        <option value="weekly">Weekly</option>
                                        <option value="monthly">Monthly</option>
                                        <option value="yearly">Yearly</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs text-text-secondary block mb-1">End Date (Optional)</label>
                                    <input type="date" name="recurringEndDate" value={formData.recurringEndDate || ''} onChange={handleChange} className="w-full bg-background border border-border rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary text-sm"/>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                <div className="p-4 bg-background rounded-b-xl flex justify-end gap-2">
                    <button type="button" onClick={onClose} className="bg-border hover:bg-border/70 text-text-primary font-semibold py-2 px-4 rounded-lg text-sm">Cancel</button>
                    <button type="submit" className="bg-primary hover:bg-primary-dark text-white font-semibold py-2 px-4 rounded-lg text-sm">Save Invoice</button>
                </div>
            </form>
        </Modal>
    )
}

export default InvoicingPage;