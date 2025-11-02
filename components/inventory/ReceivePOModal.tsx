import React, { useState, useMemo, useEffect } from 'react';
import { PurchaseOrder, PurchaseOrderItem } from '../../types';
import Modal from '../ui/Modal';
import { Package } from 'lucide-react';
import { useAppContext } from '../../contexts/AppContext';

interface ReceivePOModalProps {
    po: PurchaseOrder;
    onSave: (updatedPO: PurchaseOrder, stockUpdates: { productId: string; quantity: number }[]) => void;
    onClose: () => void;
}

const ReceivePOModal: React.FC<ReceivePOModalProps> = ({ po, onSave, onClose }) => {
    const { currency } = useAppContext();
    const [receivingQuantities, setReceivingQuantities] = useState<Record<string, string>>({});

    useEffect(() => {
        const initialQuantities: Record<string, string> = {};
        po.items.forEach(item => {
            const remaining = item.quantity - (item.quantityReceived || 0);
            initialQuantities[item.productId] = remaining.toString();
        });
        setReceivingQuantities(initialQuantities);
    }, [po]);

    const handleQuantityChange = (productId: string, value: string) => {
        const originalItem = po.items.find(i => i.productId === productId);
        if (!originalItem) return;

        const remaining = originalItem.quantity - (originalItem.quantityReceived || 0);
        const numericValue = parseInt(value, 10);

        if (value === '' || (numericValue >= 0 && numericValue <= remaining)) {
            setReceivingQuantities(prev => ({...prev, [productId]: value}));
        }
    };

    const handleSubmit = () => {
        const stockUpdates: { productId: string; quantity: number }[] = [];
        let allItemsReceived = true;

        const updatedItems = po.items.map(item => {
            const quantityReceivedNow = parseInt((receivingQuantities[item.productId] as string) || '0', 10);
            if (isNaN(quantityReceivedNow)) {
                return item;
            }
            
            if (quantityReceivedNow > 0) {
                stockUpdates.push({ productId: item.productId, quantity: quantityReceivedNow });
            }

            const totalReceived = (item.quantityReceived || 0) + quantityReceivedNow;
            if (totalReceived < item.quantity) {
                allItemsReceived = false;
            }

            return { ...item, quantityReceived: totalReceived };
        });

        const totalReceivedCount = updatedItems.reduce((sum: number, item) => sum + (item.quantityReceived || 0), 0);
        const newStatus: PurchaseOrder['status'] = allItemsReceived ? 'Received' : totalReceivedCount > 0 ? 'Partial' : po.status;

        const updatedPO: PurchaseOrder = {
            ...po,
            items: updatedItems,
            status: newStatus,
        };

        onSave(updatedPO, stockUpdates);
    };
    
    const isAnythingBeingReceived = Object.values(receivingQuantities).some(qty => parseInt((qty as string) || '0') > 0);

    return (
        <Modal title={`Receive Stock for PO ${po.id}`} onClose={onClose}>
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                <div className="bg-background p-3 rounded-md border border-border">
                    <p><strong>Supplier:</strong> {po.supplierName}</p>
                    <p className="text-sm text-text-secondary">Enter the quantity you are receiving for each item below.</p>
                </div>
                
                {po.items.map(item => {
                    const remaining = item.quantity - (item.quantityReceived || 0);
                    if (remaining <= 0) return null; // Don't show fully received items
                    return (
                        <div key={item.productId} className="grid grid-cols-5 items-center gap-4 bg-surface p-3 rounded-lg">
                            <div className="col-span-2">
                                <p className="font-medium text-text-primary text-sm">{item.name}</p>
                                <p className="text-xs text-text-secondary">Ordered: {item.quantity} | Received: {item.quantityReceived || 0}</p>
                            </div>
                            <div className="col-span-2 text-sm text-text-secondary">
                                <label htmlFor={`qty-${item.productId}`} className="block text-xs mb-1">Receiving Now:</label>
                                <input
                                    id={`qty-${item.productId}`}
                                    type="number"
                                    value={receivingQuantities[item.productId] || ''}
                                    onChange={e => handleQuantityChange(item.productId, e.target.value)}
                                    max={remaining}
                                    min="0"
                                    className="w-full bg-background border border-border rounded-md px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary text-sm"
                                    placeholder={`Max ${remaining}`}
                                />
                            </div>
                             <div className="text-right">
                                <button
                                    onClick={() => handleQuantityChange(item.productId, remaining.toString())}
                                    className="text-primary hover:underline text-sm font-semibold"
                                >
                                    Receive All
                                </button>
                             </div>
                        </div>
                    );
                })}
                 {!po.items.some(item => (item.quantity - (item.quantityReceived || 0)) > 0) && (
                     <div className="text-center py-8 text-text-secondary">
                         <Package size={32} className="mx-auto mb-2"/>
                         All items for this PO have already been received.
                     </div>
                 )}
            </div>
            <div className="p-4 bg-background rounded-b-xl flex justify-end gap-2">
                <button type="button" onClick={onClose} className="bg-border hover:bg-border/70 text-text-primary font-semibold py-2 px-4 rounded-lg text-sm">Cancel</button>
                <button type="button" onClick={handleSubmit} disabled={!isAnythingBeingReceived} className="bg-primary hover:bg-primary-dark text-white font-semibold py-2 px-4 rounded-lg text-sm disabled:bg-primary/50 disabled:cursor-not-allowed">
                    Save Receipt
                </button>
            </div>
        </Modal>
    );
};

export default ReceivePOModal;
