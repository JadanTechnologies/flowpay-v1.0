
import React, { useState, useMemo } from 'react';
import { Customer } from '../../types';
import Modal from '../ui/Modal';
import { useAppContext } from '../../contexts/AppContext';
import { formatCurrency } from '../../utils/formatting';
import { Search, UserPlus } from 'lucide-react';

interface ChargeToCustomerModalProps {
    onClose: () => void;
    onCharge: (customer: Customer) => void;
    onAddNewCustomer: () => void;
}

const ChargeToCustomerModal: React.FC<ChargeToCustomerModalProps> = ({ onClose, onCharge, onAddNewCustomer }) => {
    const { customers, currency } = useAppContext();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);

    const filteredCustomers = useMemo(() => {
        return customers.filter(c => 
            c.id !== 'cust_4' && // Exclude walk-in customer
            (c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
            (c.phone && c.phone.includes(searchTerm)) || 
            (c.email && c.email.toLowerCase().includes(searchTerm.toLowerCase())))
        );
    }, [customers, searchTerm]);

    const handleConfirm = () => {
        const customer = customers.find(c => c.id === selectedCustomerId);
        if (customer) {
            onCharge(customer);
        }
    };
    
    return (
        <Modal title="Charge to Customer Account" onClose={onClose}>
            <div className="p-6">
                <div className="flex gap-2 mb-4">
                    <div className="relative flex-grow">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" size={18} />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            placeholder="Search by name, email, or phone"
                            className="w-full bg-background border border-border rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>
                    <button onClick={onAddNewCustomer} className="flex items-center justify-center gap-2 bg-primary/20 text-primary font-semibold py-2 px-3 rounded-lg hover:bg-primary/40 transition-colors">
                        <UserPlus size={16} /> Add New
                    </button>
                </div>

                <div className="max-h-64 overflow-y-auto space-y-2">
                    {filteredCustomers.map(customer => (
                        <button
                            key={customer.id}
                            onClick={() => setSelectedCustomerId(customer.id)}
                            className={`w-full text-left p-3 rounded-lg border-2 transition-colors ${selectedCustomerId === customer.id ? 'border-primary bg-primary/10' : 'border-border bg-background'}`}
                        >
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="font-semibold text-text-primary">{customer.name}</p>
                                    <p className="text-xs text-text-secondary">{customer.email || customer.phone}</p>
                                </div>
                                <div className="text-right">
                                     <p className="font-semibold text-text-primary">{formatCurrency(customer.creditBalance, currency)}</p>
                                     <p className="text-xs text-text-secondary">Current Balance</p>
                                </div>
                            </div>
                        </button>
                    ))}
                    {filteredCustomers.length === 0 && (
                        <p className="text-center text-text-secondary py-8">No customers found.</p>
                    )}
                </div>
            </div>

             <div className="p-4 bg-background rounded-b-xl flex justify-end gap-2">
                <button type="button" onClick={onClose} className="bg-border hover:bg-border/70 text-text-primary font-semibold py-2 px-4 rounded-lg text-sm">Cancel</button>
                <button 
                    type="button" 
                    onClick={handleConfirm}
                    disabled={!selectedCustomerId}
                    className="bg-primary hover:bg-primary-dark text-white font-semibold py-2 px-4 rounded-lg text-sm disabled:bg-primary/50 disabled:cursor-not-allowed"
                >
                    Confirm Charge
                </button>
            </div>
        </Modal>
    )
};

export default ChargeToCustomerModal;
