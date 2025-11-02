import React, { useState } from 'react';
import { Product, ProductVariant } from '../../types';
import Modal from '../ui/Modal';
import { useAppContext } from '../../contexts/AppContext';

interface StockAdjustmentModalProps {
    product: Product;
    variant: ProductVariant;
    onSave: (data: { variantId: string; newStock: number; reason: string }) => void;
    onClose: () => void;
}

const StockAdjustmentModal: React.FC<StockAdjustmentModalProps> = ({ product, variant, onSave, onClose }) => {
    const { branches, currentBranchId } = useAppContext();
    const currentBranchName = branches.find(b => b.id === currentBranchId)?.name || 'Unknown Branch';
    const currentStockInBranch = variant.stockByBranch[currentBranchId] || 0;

    const [newStock, setNewStock] = useState<string>(currentStockInBranch.toString());
    const [reason, setReason] = useState<string>('');
    const stockChange = (parseInt(newStock) || 0) - currentStockInBranch;
    
    const variantName = `${product.name} ${Object.values(variant.options).join(' ')}`.trim();


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (reason.trim() === '') {
            alert('A reason for the adjustment is required.');
            return;
        }
        if (newStock === '' || parseInt(newStock) < 0) {
            alert('Please enter a valid stock quantity.');
            return;
        }
        onSave({ variantId: variant.id, newStock: parseInt(newStock), reason });
    };

    return (
        <Modal title={`Adjust Stock for ${variantName}`} onClose={onClose}>
            <form onSubmit={handleSubmit}>
                <div className="p-6 space-y-4">
                    <div className="bg-background p-3 rounded-lg border border-border">
                        <p className="text-sm font-semibold text-text-primary">Branch: {currentBranchName}</p>
                        <p className="text-xs text-text-secondary">Stock adjustments will only apply to this branch.</p>
                    </div>
                    <div className="grid grid-cols-3 gap-4 items-center">
                         <div className="text-center bg-background p-3 rounded-lg border border-border">
                            <p className="text-xs text-text-secondary">Current Stock</p>
                            <p className="text-2xl font-bold text-text-primary">{currentStockInBranch}</p>
                        </div>
                        <div className="text-center bg-background p-3 rounded-lg border border-border">
                            <p className="text-xs text-text-secondary">Adjustment</p>
                            <p className={`text-2xl font-bold ${stockChange > 0 ? 'text-green-500' : stockChange < 0 ? 'text-red-500' : 'text-text-primary'}`}>
                                {stockChange > 0 ? `+${stockChange}` : stockChange}
                            </p>
                        </div>
                         <div className="text-center bg-primary/10 p-3 rounded-lg border border-primary">
                            <p className="text-xs text-primary/80">New Stock</p>
                            <p className="text-2xl font-bold text-primary">{parseInt(newStock) || 0}</p>
                        </div>
                    </div>
                    <div>
                        <label className="text-sm text-text-secondary block mb-1">Set New Stock Quantity</label>
                        <input
                            type="number"
                            name="newStock"
                            value={newStock}
                            onChange={(e) => setNewStock(e.target.value)}
                            required
                            min="0"
                            className="w-full bg-background border border-border rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary text-sm"
                        />
                    </div>
                    <div>
                        <label className="text-sm text-text-secondary block mb-1">Reason for Adjustment</label>
                        <textarea
                            name="reason"
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            required
                            rows={3}
                            className="w-full bg-background border border-border rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary text-sm"
                            placeholder="e.g., Stock count correction, Damaged goods, Promotional use..."
                        />
                    </div>
                </div>
                <div className="p-4 bg-background rounded-b-xl flex justify-end gap-2">
                    <button type="button" onClick={onClose} className="bg-border hover:bg-border/70 text-text-primary font-semibold py-2 px-4 rounded-lg text-sm">Cancel</button>
                    <button type="submit" className="bg-primary hover:bg-primary-dark text-white font-semibold py-2 px-4 rounded-lg text-sm">Save Adjustment</button>
                </div>
            </form>
        </Modal>
    );
};

export default StockAdjustmentModal;