import React, { useState, useMemo } from 'react';
import { Consignment, ConsignmentItem } from '../../types';
import Modal from '../ui/Modal';
import { useAppContext } from '../../contexts/AppContext';
import { PlusCircle, Trash2 } from 'lucide-react';

interface ConsignmentFormModalProps {
    onSave: (consignment: Consignment) => void;
    onClose: () => void;
}

const ConsignmentFormModal: React.FC<ConsignmentFormModalProps> = ({ onSave, onClose }) => {
    const { branches, trucks, drivers, products, currentBranchId } = useAppContext();

    const [originBranchId, setOriginBranchId] = useState(currentBranchId);
    const [destinationAddress, setDestinationAddress] = useState('');
    const [truckId, setTruckId] = useState('');
    const [driverId, setDriverId] = useState('');
    const [notes, setNotes] = useState('');
    const [items, setItems] = useState<ConsignmentItem[]>([]);

    const [newItem, setNewItem] = useState<{ variantId: string; quantity: string }>({ variantId: '', quantity: '1' });

    const availableProducts = useMemo(() => {
        return products.flatMap(p => 
            p.variants
                .filter(v => (v.stockByBranch[originBranchId] || 0) > 0)
                .map(v => {
                    const variantName = Object.values(v.options).join(' ');
                    const displayName = variantName ? `${p.name} - ${variantName}` : p.name;
                    return {
                        id: v.id,
                        name: displayName,
                        stock: v.stockByBranch[originBranchId] || 0,
                    };
                })
        );
    }, [products, originBranchId]);

    const handleAddItem = () => {
        const quantity = parseInt(newItem.quantity, 10);
        if (!newItem.variantId || !quantity || quantity <= 0) {
            alert("Please select a product and enter a valid quantity.");
            return;
        }

        const productInfo = availableProducts.find(p => p.id === newItem.variantId);
        if (!productInfo) return;

        if (quantity > productInfo.stock) {
            alert(`Not enough stock. Only ${productInfo.stock} units available.`);
            return;
        }
        
        if (items.some(item => item.variantId === newItem.variantId)) {
            alert("This item is already in the consignment. You can remove it to add a different quantity.");
            return;
        }

        setItems(prev => [...prev, { variantId: newItem.variantId, quantity }]);
        setNewItem({ variantId: '', quantity: '1' });
    };

    const handleRemoveItem = (variantId: string) => {
        setItems(prev => prev.filter(item => item.variantId !== variantId));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!originBranchId || !destinationAddress || !truckId || !driverId || items.length === 0) {
            alert("Please fill all required fields and add at least one item.");
            return;
        }

        const newConsignment: Consignment = {
            id: `CON-${Date.now()}`,
            originBranchId,
            destinationAddress,
            truckId,
            driverId,
            items,
            notes,
            status: 'Pending',
            dispatchDate: null,
            deliveryDate: null,
        };
        onSave(newConsignment);
    };

    return (
        <Modal title="Create New Consignment" onClose={onClose}>
            <form onSubmit={handleSubmit}>
                <div className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
                    {/* Header fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm text-text-secondary block mb-1">Origin Branch</label>
                            <select value={originBranchId} onChange={e => setOriginBranchId(e.target.value)} required className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm">
                                {branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                            </select>
                        </div>
                         <div>
                            <label className="text-sm text-text-secondary block mb-1">Destination Address</label>
                            <input type="text" value={destinationAddress} onChange={e => setDestinationAddress(e.target.value)} required placeholder="e.g., 123 Main St, Anytown" className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm" />
                        </div>
                        <div>
                            <label className="text-sm text-text-secondary block mb-1">Truck</label>
                            <select value={truckId} onChange={e => setTruckId(e.target.value)} required className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm">
                                <option value="">Select a truck...</option>
                                {trucks.filter(t=>t.status==='Idle').map(t => <option key={t.id} value={t.id}>{t.licensePlate} ({t.model})</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="text-sm text-text-secondary block mb-1">Driver</label>
                            <select value={driverId} onChange={e => setDriverId(e.target.value)} required className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm">
                                <option value="">Select a driver...</option>
                                {drivers.filter(d=>d.status==='Idle').map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                            </select>
                        </div>
                    </div>
                    {/* Items */}
                    <div className="pt-4 border-t border-border">
                        <h3 className="font-semibold text-text-primary mb-2">Items</h3>
                        <div className="space-y-2 mb-3">
                            {items.map(item => {
                                const productInfo = availableProducts.find(p => p.id === item.variantId) || products.flatMap(p => p.variants.map(v => ({ id: v.id, name: p.name }))).find(p => p.id === item.variantId);
                                const product = products.find(p => p.variants.some(v => v.id === item.variantId));
                                const variant = product?.variants.find(v => v.id === item.variantId);
                                const displayName = product ? `${product.name} ${Object.values(variant?.options || {}).join(' ')}`.trim() : 'Unknown';
                                
                                return (
                                    <div key={item.variantId} className="flex items-center gap-2 bg-background p-2 rounded-md">
                                        <div className="flex-1">
                                            <p className="font-medium text-text-primary text-sm">{displayName}</p>
                                            <p className="text-xs text-text-secondary">Quantity: {item.quantity}</p>
                                        </div>
                                        <button type="button" onClick={() => handleRemoveItem(item.variantId)}><Trash2 className="text-red-500" size={16}/></button>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="flex items-end gap-2 p-2 border border-dashed border-border rounded-md">
                            <div className="flex-grow">
                                <label className="text-xs text-text-secondary">Product</label>
                                <select value={newItem.variantId} onChange={e => setNewItem({ ...newItem, variantId: e.target.value })} className="w-full text-sm bg-surface border border-border rounded-md p-1.5">
                                    <option value="">Select Product...</option>
                                    {availableProducts.map(p => <option key={p.id} value={p.id}>{p.name} ({p.stock} available)</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="text-xs text-text-secondary">Qty</label>
                                <input type="number" value={newItem.quantity} onChange={e => setNewItem({ ...newItem, quantity: e.target.value })} min="1" className="w-24 text-sm bg-surface border border-border rounded-md p-1.5"/>
                            </div>
                            <button type="button" onClick={handleAddItem} className="p-2 bg-primary/20 text-primary rounded-md"><PlusCircle size={20}/></button>
                        </div>
                    </div>
                     <div className="pt-2">
                        <label className="text-sm text-text-secondary block mb-1">Notes (Optional)</label>
                        <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2} className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm" />
                    </div>
                </div>
                <div className="p-4 bg-background flex justify-end gap-2">
                    <button type="button" onClick={onClose} className="bg-border text-text-primary font-semibold py-2 px-4 rounded-lg text-sm">Cancel</button>
                    <button type="submit" className="bg-primary text-white font-semibold py-2 px-4 rounded-lg text-sm">Create Consignment</button>
                </div>
            </form>
        </Modal>
    );
};

export default ConsignmentFormModal;
