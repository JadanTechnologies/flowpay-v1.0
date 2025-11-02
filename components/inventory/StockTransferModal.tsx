

import React, { useState, useMemo, useEffect } from 'react';
import { StockTransfer, Product, ProductVariant } from '../../types';
import Modal from '../ui/Modal';
import { useAppContext } from '../../contexts/AppContext';
import { PlusCircle, Trash2 } from 'lucide-react';

interface StockTransferModalProps {
    onClose: () => void;
    onSave: (transfer: StockTransfer) => void;
}

const StockTransferModal: React.FC<StockTransferModalProps> = ({ onClose, onSave }) => {
    const { branches, products, currentBranchId } = useAppContext();
    const [fromBranch, setFromBranch] = useState(currentBranchId);
    const [toBranch, setToBranch] = useState('');
    // FIX: Use variantId to align with the StockTransfer type.
    const [items, setItems] = useState<{ variantId: string, quantity: number }[]>([]);
    const [notes, setNotes] = useState('');

    // FIX: Use variantId for the new item state.
    const [newItem, setNewItem] = useState({ variantId: '', quantity: '' });

    const availableToBranches = useMemo(() => branches.filter(b => b.id !== fromBranch), [branches, fromBranch]);
    
    useEffect(() => {
        // If the 'from' branch changes, reset the 'to' branch if it's no longer valid
        if (fromBranch === toBranch) {
            setToBranch('');
        }
    }, [fromBranch, toBranch]);

    const handleAddItem = () => {
        const quantity = parseInt(newItem.quantity, 10);
        // FIX: Check newItem.variantId instead of productId.
        if (!newItem.variantId || !quantity || quantity <= 0) {
            alert("Please select a product and enter a valid quantity.");
            return;
        }

        let product: Product | undefined;
        let variant: ProductVariant | undefined;
        for (const p of products) {
            // FIX: Find variant by its ID.
            const v = p.variants.find(v => v.id === newItem.variantId);
            if(v) {
                product = p;
                variant = v;
                break;
            }
        }
        if (!product || !variant) {
            alert("Selected product variant not found.");
            return;
        }

        const stockInFromBranch = variant.stockByBranch[fromBranch] || 0;
        if (quantity > stockInFromBranch) {
            alert(`Not enough stock. Only ${stockInFromBranch} units available in ${branches.find(b => b.id === fromBranch)?.name}.`);
            return;
        }
        
        if (items.some(item => item.variantId === newItem.variantId)) {
            alert("This item is already in the consignment. You can remove it to add a different quantity.");
            return;
        }

        // FIX: Add variantId to the items array.
        setItems(prev => [...prev, { variantId: newItem.variantId, quantity }]);
        setNewItem({ variantId: '', quantity: '' });
    };
    
     const handleRemoveItem = (variantId: string) => {
        setItems(prev => prev.filter(item => item.variantId !== variantId));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!fromBranch || !toBranch || items.length === 0) {
            alert("Please select source and destination branches and add at least one item.");
            return;
        }

        const newTransfer: StockTransfer = {
            id: `ST-${Date.now()}`,
            fromBranchId: fromBranch,
            toBranchId: toBranch,
            createdDate: new Date().toISOString().split('T')[0],
            status: 'Pending',
            items,
            notes,
        };
        onSave(newTransfer);
    };

    return (
        <Modal title="New Stock Transfer" onClose={onClose}>
            <form onSubmit={handleSubmit}>
                <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm text-text-secondary block mb-1">From Branch</label>
                            <select value={fromBranch} onChange={e => setFromBranch(e.target.value)} className="w-full bg-background border border-border rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary text-sm">
                                {branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="text-sm text-text-secondary block mb-1">To Branch</label>
                            <select value={toBranch} onChange={e => setToBranch(e.target.value)} required className="w-full bg-background border border-border rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary text-sm">
                                <option value="">Select destination...</option>
                                {availableToBranches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-border">
                        <h3 className="font-semibold text-text-primary mb-2">Items to Transfer</h3>
                        <div className="space-y-2 mb-3">
                             {items.map(item => {
                                 const product = products.find(p => p.variants.some(v => v.id === item.variantId));
                                 const variant = product?.variants.find(v => v.id === item.variantId);
                                 const variantName = variant ? Object.values(variant.options).join(' ') : '';
                                 const displayName = product ? (variantName ? `${product.name} - ${variantName}` : product.name) : 'Unknown';

                                 return (
                                     <div key={item.variantId} className="flex items-center gap-2 bg-background p-2 rounded-md">
                                        <div className="flex-1">
                                            <p className="font-medium text-text-primary text-sm">{displayName}</p>
                                            <p className="text-xs text-text-secondary">Moving: {item.quantity} units</p>
                                        </div>
                                        <button type="button" onClick={() => handleRemoveItem(item.variantId)}><Trash2 className="text-red-500 hover:text-red-400" size={16}/></button>
                                    </div>
                                 )
                             })}
                        </div>
                         <div className="flex items-end gap-2 p-2 border border-dashed border-border rounded-md">
                            <div className="flex-grow">
                                <label className="text-xs text-text-secondary">Product</label>
                                {/* FIX: Change to variant selector and update state model. */}
                                <select value={newItem.variantId} onChange={e => setNewItem({...newItem, variantId: e.target.value})} className="w-full text-sm bg-surface border border-border rounded-md px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary">
                                    <option value="">Select Product...</option>
                                    {products.flatMap(p => 
                                        p.variants.filter(v => (v.stockByBranch[fromBranch] || 0) > 0)
                                        .map(v => {
                                            const variantName = Object.values(v.options).join(' ');
                                            const displayName = variantName ? `${p.name} - ${variantName}` : p.name;
                                            return <option key={v.id} value={v.id}>{displayName} ({(v.stockByBranch[fromBranch] || 0)} available)</option>
                                        })
                                    )}
                                </select>
                            </div>
                            <div>
                                <label className="text-xs text-text-secondary">Qty</label>
                                <input type="number" value={newItem.quantity} onChange={e => setNewItem({ ...newItem, quantity: e.target.value })} min="1" className="w-24 text-sm bg-surface border border-border rounded-md p-1.5"/>
                            </div>
                            <button type="button" onClick={handleAddItem} className="p-2 bg-primary/20 hover:bg-primary/40 text-primary rounded-md"><PlusCircle size={20}/></button>
                        </div>
                    </div>
                </div>
                <div className="p-4 bg-background rounded-b-xl flex justify-end gap-2 border-t border-border">
                    <button type="button" onClick={onClose} className="bg-border hover:bg-border/70 text-text-primary font-semibold py-2 px-4 rounded-lg text-sm">Cancel</button>
                    <button type="submit" className="bg-primary hover:bg-primary-dark text-white font-semibold py-2 px-4 rounded-lg text-sm">Create Transfer</button>
                </div>
            </form>
        </Modal>
    );
};

export default StockTransferModal;