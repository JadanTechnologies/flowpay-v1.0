import React from 'react';
import { Sale } from '../../types';
import { CheckCircle, Printer, PlusCircle } from 'lucide-react';
import Receipt from './Receipt';
import { formatCurrency } from '../../utils/formatting';
import { useAppContext } from '../../contexts/AppContext';

interface SaleSuccessModalProps {
    sale: Sale;
    onNewSale: () => void;
    onPrint: () => void;
}

const SaleSuccessModal: React.FC<SaleSuccessModalProps> = ({ sale, onNewSale, onPrint }) => {
    const { currency, tenantSettings } = useAppContext();
    const totalPaidByTender = sale.payments.filter(p => p.method !== 'Credit').reduce((sum, p) => sum + p.amount, 0);
    const changeDue = totalPaidByTender > sale.amount ? totalPaidByTender - sale.amount : 0;
    
    return (
        // Using a custom modal structure to avoid the default Modal's click-outside-to-close behavior
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
             <div className="bg-surface rounded-xl shadow-lg w-full max-w-md border border-border">
                <div className="p-6 text-center">
                    <CheckCircle className="text-green-500 mx-auto mb-4" size={48} />
                    <h2 className="text-2xl font-bold text-text-primary">Sale Successful!</h2>
                    <p className="text-text-secondary mt-1">Receipt ID: {sale.id}</p>
                    
                    <div className="my-6 text-left bg-background p-4 rounded-lg border border-border space-y-2">
                        <div className="flex justify-between text-lg">
                            <span className="text-text-secondary">Total</span>
                            <span className="font-bold text-text-primary">{formatCurrency(sale.amount, currency)}</span>
                        </div>
                         <div className="flex justify-between text-lg">
                            <span className="text-text-secondary">Paid by Tender</span>
                            <span className="font-bold text-green-400">{formatCurrency(totalPaidByTender, currency)}</span>
                        </div>
                        {changeDue > 0 && (
                            <div className="flex justify-between text-lg">
                                <span className="text-text-secondary">Change Due</span>
                                <span className="font-bold text-secondary">{formatCurrency(changeDue, currency)}</span>
                            </div>
                        )}
                         {sale.status === 'Credit' && (
                            <div className="flex justify-between text-lg">
                                <span className="text-text-secondary">Charged to Account</span>
                                <span className="font-bold text-blue-400">{formatCurrency(sale.payments.find(p => p.method === 'Credit')?.amount || 0, currency)}</span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="px-6 h-64 bg-gray-200 overflow-y-auto">
                    <Receipt sale={sale} isPreview={true} businessProfile={tenantSettings?.businessProfile} />
                </div>
                
                <div className="p-4 bg-background rounded-b-xl flex justify-between gap-2">
                    <button onClick={onPrint} className="flex-1 flex items-center justify-center gap-2 bg-border hover:bg-border/70 text-text-primary font-semibold py-3 px-4 rounded-lg text-sm">
                        <Printer size={16} /> Print Receipt
                    </button>
                    <button onClick={onNewSale} className="flex-1 flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white font-semibold py-3 px-4 rounded-lg text-sm">
                        <PlusCircle size={16} /> New Sale
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SaleSuccessModal;