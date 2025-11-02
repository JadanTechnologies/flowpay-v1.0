
import React, { useState, useMemo, useEffect } from 'react';
import { PurchaseOrder, PurchaseOrderItem, Supplier, Product, ProductVariant } from '../../types';
import Modal from '../ui/Modal';
import { PlusCircle, Trash2 } from 'lucide-react';
import { useAppContext } from '../../contexts/AppContext';
import { formatCurrency } from '../../utils/formatting';

interface PurchaseOrderModalProps {
    po: PurchaseOrder | null;
    onSave: (po: PurchaseOrder) => void;
    onClose: () => void;
}

const PurchaseOrderModal: React.FC<PurchaseOrderModalProps> = ({ po, onSave, onClose }) => {
    const { currency, suppliers, products, branches, currentBranchId } = useAppContext();
    const [formData, setFormData] = useState<Omit<PurchaseOrder, 'id' | 'totalCost' | 'supplierName'>>({
        supplierId: po?.supplierId || (suppliers.length > 0 ? suppliers[0].id : ''),
        deliveryBranchId: po?.deliveryBranchId || currentBranchId,
        createdDate: po?.createdDate || new Date().toISOString().split('T')[0],
        expectedDate: po?.expectedDate || '',
        status: po?.status || 'Pending',
        items: po?.items || [],
        notes: po?.notes || '',
    });
    
    // FIX: Use variantId in newItem state.
    const [newItem, setNewItem] = useState({ productId: '', quantity: '1', costPrice: '' });

    const totalCost = useMemo(() => {
        return formData.items.reduce((sum, item) => sum + (item.quantity * item.costPrice), 0);
    }, [formData.items]);

    // FIX: Update handleAddItem to work with variants.
    const handleAddItem = () => {
        if (!newItem.productId || parseFloat(newItem.quantity) <= 0 || parseFloat(newItem.costPrice) < 0) {
            alert('Please select a product and enter a valid quantity and cost price.');
            return;
        }

        let product: Product | undefined;
        let variant: ProductVariant | undefined;
        for (const p of products) {
            const v = p.variants.find(v => v.id === newItem.productId);
            if (v) {
                product = p;
                variant = v;
                break;
            }
        }
        if (!product || !variant) return;
        
        const variantName = Object.values(variant.options).join(' ');
        const displayName = variantName ? `${product.name} - ${variantName}` : product.name;

        const poItem: PurchaseOrderItem = {
            productId: variant.id,
            name: displayName,
            sku: variant.sku,
            quantity: parseFloat(newItem.quantity),
            costPrice: parseFloat(newItem.costPrice),
            quantityReceived: 0,
        };
        
        setFormData(prev => ({ ...prev, items: [...prev.items, poItem] }));
        setNewItem({ productId: '', quantity: '1', costPrice: '' }); // Reset for next item
    };
    
    const handleRemoveItem = (productId: string) => {
        setFormData(prev => ({...prev, items: prev.items.filter(item => item.productId !== productId)}));
    };

    // FIX: Update handleProductSelect to work with variants.
    const handleProductSelect = (variantId: string) => {
        let product: Product | undefined;
        let variant: ProductVariant | undefined;
        for (const p of products) {
            const v = p.variants.find(v => v.id === variantId);
            if (v) {
                product = p;
                variant = v;
                break;
            }
        }

        setNewItem({
            productId: variantId,
            quantity: '1',
            costPrice: variant ? variant.costPrice.toString() : ''
        });
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const supplier = suppliers.find(s => s.id === formData.supplierId);
        if (!supplier) {
            alert("Please select a valid supplier.");
            return;
        }
        onSave({ ...formData, id: po?.id || '', totalCost, supplierName: supplier.name });
    };

    return (
        <Modal title={po ? `Edit PO ${po.id}` : 'Create New Purchase Order'} onClose={onClose}>
            <form onSubmit={handleSubmit}>
                <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                    {/* Header Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm text-text-secondary block mb-1">Supplier</label>
                            <select value={formData.supplierId} onChange={e => setFormData({...formData, supplierId: e.target.value})} className="w-full bg-background border border-border rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary text-sm">
                                {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="text-sm text-text-secondary block mb-1">Deliver To Branch</label>
                            <select value={formData.deliveryBranchId} onChange={e => setFormData({...formData, deliveryBranchId: e.target.value})} className="w-full bg-background border border-border rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary text-sm">
                                {branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="text-sm text-text-secondary block mb-1">Created Date</label>
                            <input type="date" value={formData.createdDate} disabled className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm text-text-secondary" />
                        </div>
                        <div>
                            <label className="text-sm text-text-secondary block mb-1">Expected Delivery Date</label>
                            <input type="date" value={formData.expectedDate} onChange={e => setFormData({...formData, expectedDate: e.target.value})} required className="w-full bg-background border border-border rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary text-sm" />
                        </div>
                    </div>

                    <div className="pt-2">
                        <label className="text-sm text-text-secondary block mb-1">Notes (Optional)</label>
                        <textarea
                            value={formData.notes}
                            onChange={e => setFormData({ ...formData, notes: e.target.value })}
                            rows={2}
                            className="w-full bg-background border border-border rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary text-sm"
                            placeholder="Add any internal notes for this purchase order..."
                        />
                    </div>

                    {/* Items Section */}
                    <div className="pt-4 border-t border-border">
                        <h3 className="font-semibold text-text-primary mb-2">Order Items</h3>
                        {/* List of added items */}
                        <div className="space-y-2 mb-3">
                            {formData.items.map(item => (
                                <div key={item.productId} className="flex items-center gap-2 bg-background p-2 rounded-md">
                                    <div className="flex-1">
                                        <p className="font-medium text-text-primary text-sm">{item.name}</p>
                                        <p className="text-xs text-text-secondary">SKU: {item.sku}</p>
                                    </div>
                                    <p className="text-sm">{item.quantity} x {formatCurrency(item.costPrice, currency)}</p>
                                    <button type="button" onClick={() => handleRemoveItem(item.productId)}><Trash2 className="text-red-500 hover:text-red-400" size={16}/></button>
                                </div>
                            ))}
                        </div>

                        {/* Form to add new item */}
                        <div className="flex items-end gap-2 p-2 border border-dashed border-border rounded-md">
                            <div className="flex-grow">
                                <label className="text-xs text-text-secondary">Product</label>
                                {/* FIX: Change product selector to variant selector */}
                                <select value={newItem.productId} onChange={e => handleProductSelect(e.target.value)} className="w-full text-sm bg-surface border border-border rounded-md px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary">
                                    <option value="">Select Product...</option>
                                    {products.flatMap(p => 
                                        p.variants.map(v => {
                                            const variantName = Object.values(v.options).join(' ');
                                            const displayName = variantName ? `${p.name} - ${variantName}` : p.name;
                                            return <option key={v.id} value={v.id}>{displayName}</option>;
                                        })
                                    )}
                                </select>
                            </div>
                            <div>
                                <label className="text-xs text-text-secondary">Qty</label>
                                <input type="number" value={newItem.quantity} onChange={e => setNewItem({...newItem, quantity: e.target.value})} className="w-20 text-sm bg-surface border border-border rounded-md px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary"/>
                            </div>
                             <div>
                                <label className="text-xs text-text-secondary">Cost/item</label>
                                <input type="number" step="0.01" value={newItem.costPrice} onChange={e => setNewItem({...newItem, costPrice: e.target.value})} className="w-24 text-sm bg-surface border border-border rounded-md px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary"/>
                            </div>
                            <button type="button" onClick={handleAddItem} className="p-2 bg-primary/20 hover:bg-primary/40 text-primary rounded-md"><PlusCircle size={20}/></button>
                        </div>
                    </div>
                </div>

                <div className="p-4 bg-background rounded-b-xl flex justify-between items-center border-t border-border">
                    <span className="text-lg font-bold text-text-primary">Total: {formatCurrency(totalCost, currency)}</span>
                    <div className="flex gap-2">
                        <button type="button" onClick={onClose} className="bg-border hover:bg-border/70 text-text-primary font-semibold py-2 px-4 rounded-lg text-sm">Cancel</button>
                        <button type="submit" className="bg-primary hover:bg-primary-dark text-white font-semibold py-2 px-4 rounded-lg text-sm">Save Purchase Order</button>
                    </div>
                </div>
            </form>
        </Modal>
    );
};

export default PurchaseOrderModal;