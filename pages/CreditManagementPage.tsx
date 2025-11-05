import React, { useState, useMemo } from 'react';
import { Handshake, User, DollarSign, CreditCard, Mail, UserPlus } from 'lucide-react';
import { Customer, CreditTransaction } from '../types';
import Table, { Column } from '../components/ui/Table';
import Modal from '../components/ui/Modal';
import DashboardCard from '../components/dashboard/DashboardCard';
import { creditTransactions as mockTransactions } from '../data/mockData';
import { useAppContext } from '../contexts/AppContext';
import { formatCurrency } from '../utils/formatting';

interface PaymentModalProps {
    customer: Customer;
    onClose: () => void;
    onRecordPayment: (customerId: string, amount: number) => void;
    currency: string;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ customer, onClose, onRecordPayment, currency }) => {
    const [amount, setAmount] = useState<string>('');
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const paymentAmount = parseFloat(amount);
        if (isNaN(paymentAmount) || paymentAmount <= 0) {
            alert("Please enter a valid payment amount.");
            return;
        }
        if (paymentAmount > customer.creditBalance) {
            if (!window.confirm("Payment amount is greater than the outstanding balance. Record payment anyway?")) {
                return;
            }
        }
        onRecordPayment(customer.id, paymentAmount);
    };

    return (
        <Modal title={`Record Payment for ${customer.name}`} onClose={onClose}>
            <form onSubmit={handleSubmit}>
                <div className="p-6 space-y-4">
                    <p className="text-text-secondary">Outstanding Balance: <span className="font-bold text-text-primary">{formatCurrency(customer.creditBalance, currency)}</span></p>
                    <div>
                        <label className="text-sm text-text-secondary block mb-1">Payment Amount</label>
                        <input
                            type="number"
                            name="amount"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            step="0.01"
                            min="0.01"
                            required
                            className="w-full bg-background border border-border rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary text-sm"
                            placeholder="0.00"
                        />
                    </div>
                </div>
                <div className="p-4 bg-background rounded-b-xl flex justify-end gap-2">
                    <button type="button" onClick={onClose} className="bg-border hover:bg-border/70 text-text-primary font-semibold py-2 px-4 rounded-lg text-sm">Cancel</button>
                    <button type="submit" className="bg-primary hover:bg-primary-dark text-white font-semibold py-2 px-4 rounded-lg text-sm">Record Payment</button>
                </div>
            </form>
        </Modal>
    )
}

interface CreditLimitModalProps {
    customer: Customer;
    onClose: () => void;
    onSetLimit: (customerId: string, limit: number | null) => void;
    currency: string;
}

const CreditLimitModal: React.FC<CreditLimitModalProps> = ({ customer, onClose, onSetLimit, currency }) => {
    const [limit, setLimit] = useState<string>(customer.creditLimit?.toString() || '');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const limitAmount = limit === '' ? null : parseFloat(limit);
        if (limit !== '' && (isNaN(limitAmount!) || limitAmount! < 0)) {
            alert("Please enter a valid, non-negative limit, or leave it blank for no limit.");
            return;
        }
        onSetLimit(customer.id, limitAmount);
    };

    return (
        <Modal title={`Set Credit Limit for ${customer.name}`} onClose={onClose}>
            <form onSubmit={handleSubmit}>
                <div className="p-6 space-y-4">
                    <p className="text-text-secondary">Current Outstanding Balance: <span className="font-bold text-text-primary">{formatCurrency(customer.creditBalance, currency)}</span></p>
                    <div>
                        <label className="text-sm text-text-secondary block mb-1">Credit Limit</label>
                        <input
                            type="number"
                            name="limit"
                            value={limit}
                            onChange={(e) => setLimit(e.target.value)}
                            step="0.01"
                            min="0"
                            className="w-full bg-background border border-border rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary text-sm"
                            placeholder="Leave blank for no limit"
                        />
                    </div>
                </div>
                <div className="p-4 bg-background rounded-b-xl flex justify-end gap-2">
                    <button type="button" onClick={onClose} className="bg-border hover:bg-border/70 text-text-primary font-semibold py-2 px-4 rounded-lg text-sm">Cancel</button>
                    <button type="submit" className="bg-primary hover:bg-primary-dark text-white font-semibold py-2 px-4 rounded-lg text-sm">Set Limit</button>
                </div>
            </form>
        </Modal>
    )
}

const CreditManagementPage: React.FC = () => {
    const { customers: allCustomers, setCustomers, currency, addNotification, notificationPrefs } = useAppContext();
    const [transactions, setTransactions] = useState<CreditTransaction[]>(mockTransactions);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
    const [isLimitModalOpen, setIsLimitModalOpen] = useState(false);

    const customersWithCredit = useMemo(() => allCustomers.filter(c => c.creditBalance > 0), [allCustomers]);

    const totalOutstanding = customersWithCredit.reduce((sum, c) => sum + c.creditBalance, 0);
    const customersOnCredit = customersWithCredit.length;

    const openPaymentModal = (customer: Customer) => {
        setSelectedCustomer(customer);
        setIsPaymentModalOpen(true);
    };

    const openLimitModal = (customer: Customer) => {
        setSelectedCustomer(customer);
        setIsLimitModalOpen(true);
    };

    const handleSetCreditLimit = (customerId: string, limit: number | null) => {
        setCustomers(prev => prev.map(c => 
            c.id === customerId ? { ...c, creditLimit: limit === null ? undefined : limit } : c
        ));
        setIsLimitModalOpen(false);
        setSelectedCustomer(null);
        addNotification({ message: 'Credit limit updated successfully.', type: 'success' });
    };
    
    const handleRecordPayment = (customerId: string, amount: number) => {
        setCustomers(prev => prev.map(c => 
            c.id === customerId ? { ...c, creditBalance: c.creditBalance - amount } : c
        ));

        const newTransaction: CreditTransaction = {
            id: `ctx_${new Date().getTime()}`,
            customerId,
            date: new Date().toISOString().split('T')[0],
            type: 'Payment',
            amount: -amount
        };
        setTransactions(prev => [newTransaction, ...prev]);

        setIsPaymentModalOpen(false);
        setSelectedCustomer(null);
    };

    const handleSendReminder = (customer: Customer) => {
        if (!customer.email) {
            addNotification({ message: "This customer does not have an email address on file.", type: 'error'});
            return;
        }

        console.log(`Simulating sending reminder to ${customer.email} for an outstanding balance of ${formatCurrency(customer.creditBalance, currency)}.`);

        if (notificationPrefs.creditReminderEmail) {
            addNotification({ message: `Payment reminder email sent to ${customer.name}.`, type: 'success' });
        }
    };

    const columns: Column<Customer>[] = [
        { header: 'Customer', accessor: 'name', sortable: true },
        { header: 'Phone', accessor: 'phone' },
        { header: 'Email', accessor: 'email' },
        { header: 'Outstanding Credit', accessor: 'creditBalance', sortable: true, render: (row) => formatCurrency(row.creditBalance, currency) },
        { 
            header: 'Credit Limit', 
            accessor: 'creditLimit', 
            sortable: true, 
            render: (row) => row.creditLimit !== undefined ? formatCurrency(row.creditLimit, currency) : <span className="text-text-secondary">No Limit</span> 
        },
        {
            header: 'Actions',
            accessor: 'actions',
            render: (row) => (
                <div className="flex items-center gap-2">
                    <button onClick={() => openPaymentModal(row)} className="flex items-center gap-2 text-sm bg-primary/20 text-primary font-semibold py-1 px-3 rounded-lg hover:bg-primary/40 transition-colors">
                        <CreditCard size={14} /> Record Payment
                    </button>
                     <button onClick={() => openLimitModal(row)} className="flex items-center gap-2 text-sm bg-yellow-600/20 text-yellow-400 font-semibold py-1 px-3 rounded-lg hover:bg-yellow-600/40 transition-colors">
                        <UserPlus size={14} /> Set Limit
                    </button>
                    <button 
                        onClick={() => handleSendReminder(row)}
                        disabled={!row.email}
                        className="flex items-center gap-2 text-sm bg-blue-600/20 text-blue-400 font-semibold py-1 px-3 rounded-lg hover:bg-blue-600/40 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        title={row.email ? "Send payment reminder" : "No email on file"}
                    >
                        <Mail size={14} /> Send Reminder
                    </button>
                </div>
            )
        }
    ];

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-text-primary">Credit Management</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <DashboardCard title="Total Outstanding Credit" value={formatCurrency(totalOutstanding, currency)} change="" icon={<DollarSign className="text-red-500" />} />
                <DashboardCard title="Customers on Credit" value={`${customersOnCredit}`} change="" icon={<User className="text-blue-500" />} />
            </div>
            <div className="bg-surface border border-border rounded-xl p-6 shadow-lg">
                <h2 className="text-xl font-semibold text-text-primary mb-4">Customer Balances</h2>
                <Table columns={columns} data={customersWithCredit} />
            </div>

            {isPaymentModalOpen && selectedCustomer && (
                <PaymentModal
                    customer={selectedCustomer}
                    onClose={() => setIsPaymentModalOpen(false)}
                    onRecordPayment={handleRecordPayment}
                    currency={currency}
                />
            )}
            {isLimitModalOpen && selectedCustomer && (
                <CreditLimitModal
                    customer={selectedCustomer}
                    onClose={() => setIsLimitModalOpen(false)}
                    onSetLimit={handleSetCreditLimit}
                    currency={currency}
                />
            )}
        </div>
    );
};

export default CreditManagementPage;
