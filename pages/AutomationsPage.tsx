import React, { useState, useMemo } from 'react';
import { Repeat, PlusCircle, Edit, Trash2, Play, Pause, PlayCircle } from 'lucide-react';
import { ScheduledJob, Invoice } from '../types';
import { useAppContext } from '../contexts/AppContext';
import Table, { Column } from '../components/ui/Table';
import JobModal from '../components/automations/JobModal';
import { customers as mockCustomers, recentSales } from '../data/mockData';
import { formatCurrency } from '../utils/formatting';

const getStatusBadge = (status: ScheduledJob['status']) => {
    switch (status) {
        case 'active': return <span className="px-2 py-1 text-xs font-medium text-green-300 bg-green-900 rounded-full">{status}</span>;
        case 'paused': return <span className="px-2 py-1 text-xs font-medium text-gray-300 bg-gray-700 rounded-full">{status}</span>;
        case 'error': return <span className="px-2 py-1 text-xs font-medium text-red-300 bg-red-900 rounded-full">{status}</span>;
    }
};

const taskTypeLabels: Record<ScheduledJob['taskType'], string> = {
    'email_report': 'Email Report',
    'low_stock_alert': 'Low Stock Alert',
    'data_backup': 'Data Backup',
    'credit_reminder': 'Credit Reminders',
    'recurring_invoice': 'Recurring Invoice',
};

const AutomationsPage: React.FC = () => {
    const { scheduledJobs, setScheduledJobs, session, products, currency, invoices, setInvoices } = useAppContext();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingJob, setEditingJob] = useState<ScheduledJob | null>(null);

    const tenantJobs = useMemo(() => {
        // FIX: Access tenant_id from user's app_metadata
        return scheduledJobs.filter(job => job.tenantId === session?.user.app_metadata.tenant_id);
    }, [scheduledJobs, session?.user?.app_metadata.tenant_id]);


    const openModalForNew = () => {
        setEditingJob(null);
        setIsModalOpen(true);
    };

    const openModalForEdit = (job: ScheduledJob) => {
        setEditingJob(job);
        setIsModalOpen(true);
    };

    const handleSaveJob = (job: ScheduledJob) => {
        if (editingJob) {
            setScheduledJobs(prev => prev.map(j => j.id === job.id ? job : j));
        } else {
            const newJob = { ...job, id: `job_${Date.now()}` };
            setScheduledJobs(prev => [newJob, ...prev]);
        }
        setIsModalOpen(false);
    };

    const handleDeleteJob = (id: string) => {
        if (window.confirm('Are you sure you want to delete this scheduled job?')) {
            setScheduledJobs(prev => prev.filter(j => j.id !== id));
        }
    };
    
    const handleToggleStatus = (job: ScheduledJob) => {
        const newStatus = job.status === 'active' ? 'paused' : 'active';
        setScheduledJobs(prev => prev.map(j => j.id === job.id ? {...j, status: newStatus} : j));
    };

    const handleRunJobNow = (job: ScheduledJob) => {
        console.log(`Manually executing job: ${job.name}`);
        
        let executionMessage = '';
        const attachmentFormat = job.config.attachmentFormat || 'csv';

        switch (job.taskType) {
            case 'email_report':
                if (job.config.reportType === 'daily_sales') {
                    const totalSales = recentSales.reduce((sum: number, sale) => sum + Number(sale.amount), 0);
                    executionMessage = `Email Report Sent to ${job.config.recipientEmail} as a .${attachmentFormat.toUpperCase()} file.\n\nReport Type: Daily Sales Summary\nTotal Sales Today: ${formatCurrency(totalSales, currency)}\nTransactions: ${recentSales.length}`;
                } else if (job.config.reportType === 'inventory_summary') {
                    const totalProducts = products.length;
                    const lowStockItemsCount = products.filter(p => {
                        const totalStock = p.variants.reduce((sum: number, v) => sum + Object.keys(v.stockByBranch).reduce((s: number, key) => s + v.stockByBranch[key], 0), 0);
                        const lowStockThreshold = p.variants[0]?.lowStockThreshold || 0; // Simplified threshold
                        return totalStock > 0 && totalStock <= lowStockThreshold;
                    }).length;
                    const outOfStockItemsCount = products.filter(p => p.variants.reduce((sum: number, v) => sum + Object.keys(v.stockByBranch).reduce((s: number, key) => s + v.stockByBranch[key], 0), 0) <= 0).length;
                    executionMessage = `Email Report Sent to ${job.config.recipientEmail} as a .${attachmentFormat.toUpperCase()} file.\n\nReport Type: Inventory Summary\nTotal Products: ${totalProducts}\nItems with Low Stock: ${lowStockItemsCount}\nItems Out of Stock: ${outOfStockItemsCount}`;
                }
                break;
            case 'low_stock_alert':
                const lowStockProducts = products.filter(p => {
                    const totalStock = p.variants.reduce((sum: number, v) => sum + Object.keys(v.stockByBranch).reduce((s: number, key) => s + v.stockByBranch[key], 0), 0);
                    const lowStockThreshold = p.variants[0]?.lowStockThreshold || 0; // Simplified threshold
                    return totalStock > 0 && totalStock <= lowStockThreshold;
                });
                if (lowStockProducts.length > 0) {
                    const productDetails = lowStockProducts.map(p => `${p.name} (Stock: ${p.variants.reduce((sum: number, v) => sum + Object.keys(v.stockByBranch).reduce((s: number, key) => s + v.stockByBranch[key], 0), 0)})`).join('\n - ');
                    executionMessage = `Low Stock Alert Sent to ${job.config.recipientEmail}.\n\nItems needing attention:\n - ${productDetails}`;
                } else {
                    executionMessage = `Low stock check ran. No items are currently low on stock.`;
                }
                break;
            case 'data_backup':
                const backupData = { products, sales: recentSales, customers: mockCustomers };
                let backupContent: string;
                if (job.config.backupFormat === 'json') {
                    backupContent = JSON.stringify(backupData, null, 2);
                } else if (job.config.backupFormat === 'csv') {
                    const productHeaders = 'sku,name,price,total_stock\n';
                    const productRows = products.flatMap(p => 
                        p.variants.map(v => {
                            const variantName = Object.values(v.options).join(' ');
                            const displayName = variantName ? `${p.name} - ${variantName}` : p.name;
                            const totalStock = Object.keys(v.stockByBranch).reduce((s: number, key) => s + v.stockByBranch[key], 0);
                            return `${v.sku},"${displayName}",${v.price},${totalStock}`;
                        })
                    ).join('\n');
                    backupContent = productHeaders + productRows;
                } else {
                    backupContent = 'SQL Dump format is not implemented in this demo.';
                }
                executionMessage = `Data Backup successful.\n\nLocation: ${job.config.backupLocation}\nFormat: ${job.config.backupFormat}\n\nData (sample):\n${backupContent.substring(0, 300)}...`;
                break;
            case 'credit_reminder':
                const customersOnCredit = mockCustomers.filter(c => c.creditBalance > 0);
                if (customersOnCredit.length > 0) {
                     const customerNames = customersOnCredit.map(c => `${c.name} (${formatCurrency(c.creditBalance, currency)})`).join('\n - ');
                     executionMessage = `Credit Reminder process ran.\n\nSimulated emails sent to:\n - ${customerNames}`;
                } else {
                     executionMessage = `Credit Reminder process ran. No customers with outstanding credit found.`;
                }
                break;
            case 'recurring_invoice': {
                if (!job.config.sourceInvoiceId) {
                    executionMessage = 'Error: Source Invoice ID is missing from job config.';
                    break;
                }
                const sourceInvoice = invoices.find(inv => inv.id === job.config.sourceInvoiceId);
                if (!sourceInvoice) {
                    executionMessage = `Error: Source invoice with ID ${job.config.sourceInvoiceId} not found.`;
                    setScheduledJobs(prev => prev.map(j => j.id === job.id ? {...j, status: 'error'} : j));
                    break;
                }

                if (sourceInvoice.recurringEndDate && new Date() > new Date(sourceInvoice.recurringEndDate)) {
                    executionMessage = `Recurring invoice cycle ended on ${sourceInvoice.recurringEndDate}. Job has been paused.`;
                    setScheduledJobs(prev => prev.map(j => j.id === job.id ? {...j, status: 'paused'} : j));
                    break;
                }

                const issueDate = new Date();
                const originalIssueDate = new Date(sourceInvoice.issueDate);
                const originalDueDate = new Date(sourceInvoice.dueDate);
                const dueDays = (originalDueDate.getTime() - originalIssueDate.getTime()) / (1000 * 3600 * 24);
                const dueDate = new Date();
                dueDate.setDate(issueDate.getDate() + Math.round(dueDays));

                const newInvoice: Invoice = {
                    id: `inv_${Date.now()}`,
                    customerName: sourceInvoice.customerName,
                    issueDate: issueDate.toISOString().split('T')[0],
                    dueDate: dueDate.toISOString().split('T')[0],
                    amount: sourceInvoice.amount,
                    status: 'Due',
                    isRecurring: false, // Generated invoices are not themselves recurring templates
                };
                
                setInvoices(prev => [newInvoice, ...prev]);
                executionMessage = `Successfully generated new invoice ${newInvoice.id} for ${newInvoice.customerName}.`;
                break;
            }
            default:
                executionMessage = `Unknown job type: ${job.taskType}`;
        }

        alert(`Job "${job.name}" executed successfully.\n\n--- LOG ---\n${executionMessage}`);

        setScheduledJobs(prev => prev.map(j => 
            j.id === job.id 
                ? { ...j, lastRun: new Date().toISOString().replace('T', ' ').substring(0, 19) } 
                : j
        ));
    };


    const columns: Column<ScheduledJob>[] = [
        { 
            header: 'Job Name', 
            accessor: 'name', 
            sortable: true 
        },
        { 
            header: 'Task Type', 
            accessor: 'taskType',
            render: (row) => taskTypeLabels[row.taskType]
        },
        { 
            header: 'Schedule', 
            accessor: 'schedule', 
            render: (row) => <span className="font-mono text-xs">{row.schedule}</span>
        },
        { 
            header: 'Last Run', 
            accessor: 'lastRun', 
            sortable: true,
            render: (row) => row.lastRun ? new Date(row.lastRun).toLocaleString() : 'Never'
        },
        { 
            header: 'Status', 
            accessor: 'status', 
            render: (row) => getStatusBadge(row.status) 
        },
        {
            header: 'Actions',
            accessor: 'actions',
            render: (row) => (
                <div className="flex items-center gap-2">
                    <button title="Run Now" onClick={() => handleRunJobNow(row)} className="p-1.5 hover:bg-border rounded-md text-green-400">
                        <PlayCircle size={14} /> 
                    </button>
                    <button title={row.status === 'active' ? 'Pause' : 'Resume'} onClick={() => handleToggleStatus(row)} className="p-1.5 hover:bg-border rounded-md">
                        {row.status === 'active' ? <Pause size={14} /> : <Play size={14} />}
                    </button>
                    <button title="Edit" onClick={() => openModalForEdit(row)} className="p-1.5 hover:bg-border rounded-md"><Edit size={14} /></button>
                    <button title="Delete" onClick={() => handleDeleteJob(row.id)} className="p-1.5 hover:bg-border rounded-md"><Trash2 size={14} className="text-red-400" /></button>
                </div>
            )
        }
    ];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-text-primary">Automations</h1>
                <button onClick={openModalForNew} className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-semibold py-2 px-4 rounded-lg transition-colors">
                    <PlusCircle size={16} /> Create Job
                </button>
            </div>

            <div className="bg-surface border border-border rounded-xl p-6 shadow-lg">
                <h2 className="text-xl font-semibold text-text-primary mb-4">Scheduled Jobs</h2>
                <Table columns={columns} data={tenantJobs} />
            </div>

            {isModalOpen && (
                <JobModal
                    job={editingJob}
                    onSave={handleSaveJob}
                    onClose={() => setIsModalOpen(false)}
                />
            )}
        </div>
    );
};

export default AutomationsPage;