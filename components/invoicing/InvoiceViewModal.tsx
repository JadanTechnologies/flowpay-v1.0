import React from 'react';
import { Invoice } from '../../types';
import Modal from '../ui/Modal';
import InvoiceTemplate from './InvoiceTemplate';
import { useAppContext } from '../../contexts/AppContext';
import { Printer, Download } from 'lucide-react';

interface InvoiceViewModalProps {
    invoice: Invoice;
    onClose: () => void;
}

const InvoiceViewModal: React.FC<InvoiceViewModalProps> = ({ invoice, onClose }) => {
    const { tenantSettings, currency } = useAppContext();

    const handlePrint = () => {
        window.print();
    };

    if (!tenantSettings) {
        return <Modal title="Error" onClose={onClose}><div className="p-6">Tenant business profile not found.</div></Modal>;
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 no-print" onClick={onClose}>
            <div className="bg-surface rounded-xl shadow-lg w-full max-w-4xl h-[90vh] flex flex-col border border-border" onClick={e => e.stopPropagation()}>
                <div className="p-4 border-b border-border flex justify-between items-center">
                    <h2 className="text-xl font-bold text-text-primary">Invoice {invoice.id}</h2>
                    <div className="flex items-center gap-2">
                        <button onClick={handlePrint} className="flex items-center gap-2 bg-border hover:bg-border/70 text-text-primary font-semibold py-2 px-4 rounded-lg text-sm">
                            <Printer size={16} /> Print
                        </button>
                        <button onClick={onClose} className="bg-primary hover:bg-primary-dark text-white font-semibold py-2 px-4 rounded-lg text-sm">
                            Close
                        </button>
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto bg-gray-300 p-4">
                    <div className="mx-auto max-w-[210mm]">
                         <InvoiceTemplate 
                            invoice={invoice} 
                            businessProfile={tenantSettings.businessProfile}
                            currency={currency}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InvoiceViewModal;