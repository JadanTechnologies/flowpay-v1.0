import React, { useMemo } from 'react';
import { Consignment, Sale, CartItem } from '../../types';
import Modal from '../ui/Modal';
import Waybill from './Waybill';
import { useAppContext } from '../../contexts/AppContext';
import { Printer } from 'lucide-react';

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
        // This is a simplified print method that leverages browser printing and CSS.
        // It hides non-printable elements and then triggers the print dialog.
        const printContents = document.querySelector('.printable-report-wrapper');
        if (printContents) {
            // A more robust solution may involve creating a new window with the content
            // to avoid state loss on the main page, but this works for this context.
            window.print();
        }
    };

    return (
        <Modal title={`Waybill for Consignment ${consignment.id}`} onClose={onClose}>
             <div className="printable-report-wrapper max-h-[70vh] overflow-y-auto">
                {saleForWaybill ? (
                    <Waybill consignment={consignment} sale={saleForWaybill} />
                ) : (
                    <div className="p-8 text-center text-red-400">Could not generate waybill. Sale or customer data is missing.</div>
                )}
            </div>
             <div className="p-4 bg-background flex justify-end gap-2 no-print">
                <button type="button" onClick={onClose} className="bg-border hover:bg-border/70 text-text-primary font-semibold py-2 px-4 rounded-lg text-sm">Close</button>
                <button type="button" onClick={handlePrint} className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-semibold py-2 px-4 rounded-lg text-sm">
                    <Printer size={16} /> Print
                </button>
            </div>
        </Modal>
    );
};

export default WaybillModal;
