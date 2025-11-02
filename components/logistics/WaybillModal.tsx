import React, { useMemo } from 'react';
import { Consignment, Sale, CartItem } from '../../types';
import Modal from '../ui/Modal';
import Waybill from './Waybill';
import { useAppContext } from '../../contexts/AppContext';
import { Printer, FileDown } from 'lucide-react';

interface WaybillModalProps {
    consignment: Consignment;
    onClose: () => void;
}

const WaybillModal: React.FC<WaybillModalProps> = ({ consignment, onClose }) => {
    const { products, customers } = useAppContext();

    // Reconstruct the sale object for the waybill
    const saleForWaybill = useMemo((): Sale | null => {
        if (!consignment.soldToCustomerId) return null;

        const customer = customers.find(c => c.id === consignment.soldToCustomerId);
        if (!customer) return null;

        const saleItems: CartItem[] = consignment.items.map(item => {
            const product = products.find(p => p.variants.some(v => v.id === item.variantId));
            const variant = product?.variants.find(v => v.id === item.variantId);
            if (!product || !variant) return null;

            return {
                id: variant.id,
                productId: product.id,
                name: `${product.name} ${Object.values(variant.options).join(' ')}`.trim(),
                sku: variant.sku,
                price: variant.price,
                costPrice: variant.costPrice,
                imageUrl: product.imageUrl,
                quantity: item.quantity,
                stock: 0,
            };
        }).filter((item): item is CartItem => item !== null);

        if (saleItems.length !== consignment.items.length) return null; // data inconsistency

        const totalAmount = saleItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        return {
            id: `sale_con_${consignment.id}`,
            customerName: customer.name,
            customerId: customer.id,
            cashierName: 'System',
            date: new Date().toISOString(),
            amount: totalAmount,
            status: 'Credit',
            branch: '',
            items: saleItems,
            payments: [{ method: 'Credit', amount: totalAmount }]
        };
    }, [consignment, products, customers]);
    
    const handlePrint = () => {
        window.print();
    };

    const handleDownloadPdf = () => {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF({
            orientation: 'p',
            unit: 'mm',
            format: 'a4'
        });
    
        const waybillElement = document.querySelector('.print-area');
        if (waybillElement) {
            doc.html(waybillElement as HTMLElement, {
                callback: function (doc: any) {
                    doc.save(`waybill-${consignment.id}.pdf`);
                },
                x: 10,
                y: 10,
                width: 190, // A4 width is 210, this provides margin
                windowWidth: 794 // A4 width in pixels at 96 dpi
            });
        } else {
            alert('Could not find waybill content to generate PDF.');
        }
    };


    if (!saleForWaybill) {
        return <Modal title="Error" onClose={onClose}><div className="p-6">Could not generate waybill. Sale or customer data is missing.</div></Modal>;
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 no-print" onClick={onClose}>
            <div className="bg-surface rounded-xl shadow-lg w-full max-w-4xl h-[90vh] flex flex-col border border-border" onClick={e => e.stopPropagation()}>
                <div className="p-4 border-b border-border flex justify-between items-center">
                    <h2 className="text-xl font-bold text-text-primary">Waybill for Consignment {consignment.id}</h2>
                    <div className="flex items-center gap-2">
                         <button onClick={handleDownloadPdf} className="flex items-center gap-2 bg-surface hover:bg-border text-text-secondary font-semibold py-2 px-4 rounded-lg transition-colors border border-border">
                            <FileDown size={16} /> Download PDF
                        </button>
                        <button onClick={handlePrint} className="flex items-center gap-2 bg-border hover:bg-border/70 text-text-primary font-semibold py-2 px-4 rounded-lg text-sm">
                            <Printer size={16} /> Print
                        </button>
                        <button onClick={onClose} className="bg-primary hover:bg-primary-dark text-white font-semibold py-2 px-4 rounded-lg text-sm">
                            Close
                        </button>
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto bg-gray-300 p-4 printable-report-wrapper">
                    <div className="mx-auto max-w-[210mm]">
                         <Waybill consignment={consignment} sale={saleForWaybill} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WaybillModal;