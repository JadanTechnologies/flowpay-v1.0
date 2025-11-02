import React, { useState } from 'react';
import { Handshake, User, DollarSign, CreditCard, Trash2, Mail } from 'lucide-react';
import { Customer, CreditTransaction } from '../types';
import Table, { Column } from '../components/ui/Table';
import Modal from '../components/ui/Modal';
import DashboardCard from '../components/dashboard/DashboardCard';
import { customers as mockCustomers, creditTransactions as mockTransactions } from '../data/mockData';
import { useAppContext } from '../contexts/AppContext';
import { formatCurrency } from '../utils/formatting';

const CreditManagementPage: React.FC = () => {
    const [customers, setCustomers] = useState<Customer[]>(mockCustomers.filter(c => c.creditBalance > 0));
    const [transactions, setTransactions] = useState<CreditTransaction[]>(mockTransactions);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
    const { currency } = useAppContext();

    const totalOutstanding = customers.reduce((sum, c) => sum + c.creditBalance, 0);
    const customersOnCredit = customers.length;

    const openPaymentModal = (customer: Customer) => {
        setSelectedCustomer(customer);
        setIsPaymentModalOpen(true);
    };
    
    const handleRecordPayment = (customerId: string, amount: number) => {
        setCustomers(prev => prev.map(c => 
            c.id === customerId ? { ...c, creditBalance: c.creditBalance - amount } : c
        ).filter(c => c.creditBalance > 0));

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
            alert("This customer does not have an email address on file.");
            return;
        }
        alert(`Payment reminder sent to ${customer.name} at ${customer.email}.`);
        console.log(`Simulating sending reminder to ${customer.email} for an outstanding balance of ${formatCurrency(customer.creditBalance, currency)}.`);
    };

    const columns: Column<Customer>[] = [
        { header: 'Customer', accessor: 'name', sortable: true },
        { header: 'Phone', accessor: 'phone' },
        { header: 'Email', accessor: 'email' },
        { header: 'Outstanding Credit', accessor: 'creditBalance', sortable: true, render: (row) => formatCurrency(row.creditBalance, currency) },
        {
            header: 'Actions',
            accessor: 'actions',
            render: (row) => (
                <div className="flex items-center gap-2">
                    <button onClick={() => openPaymentModal(row)} className="flex items-center gap-2 text-sm bg-primary/20 text-primary font-semibold py-1 px-3 rounded-lg hover:bg-primary/40 transition-colors">
                        <CreditCard size={14} /> Record Payment
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
                <Table columns={columns} data={customers} />
            </div>

            {isPaymentModalOpen && selectedCustomer && (
                <PaymentModal
                    customer={selectedCustomer}
                    onClose={() => setIsPaymentModalOpen(false)}
                    onRecordPayment={handleRecordPayment}
                    currency={currency}
                />
            )}
        </div>
    );
};

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

export default CreditManagementPage;