import React, { useState, useMemo, useEffect } from 'react';
import { StockCount, StockCountItem } from '../../types';
import Modal from '../ui/Modal';
import { useAppContext } from '../../contexts/AppContext';

// FIX: Add branchId to the props interface.
interface StockCountModalProps {
    stockCount: StockCount | null;
    branchId: string;
    onClose: () => void;
    onSave: (stockCount: StockCount) => void;
}

const StockCountModal: React.FC<StockCountModalProps> = ({ stockCount, branchId, onClose, onSave }) => {
    const { products } = useAppContext();
    const [countData, setCountData] = useState<StockCount | null>(null);

    useEffect(() => {
        if (stockCount) {
            setCountData(stockCount);
        } else {
            // Create a new stock count
            const newCountItems: StockCountItem[] = products.flatMap(p => 
                p.variants.map(v => {
                    const variantName = Object.values(v.options).join(' ');
                    return {
                        productId: p.id,
                        productName: variantName ? `${p.name} - ${variantName}` : p.name,
                        sku: v.sku,
                        // FIX: Use branchId to get the correct expected quantity from variant's stockByBranch.
                        expectedQuantity: v.stockByBranch[branchId] || 0,
                        countedQuantity: null,
                    }
                })
            );
            // FIX: Add the required branchId property when creating a new stock count.
            setCountData({
                id: `SC-${Date.now()}`,
                branchId: branchId,
                date: new Date().toISOString().split('T')[0],
                status: 'In Progress',
                items: newCountItems,
                notes: '',
            });
        }
    }, [stockCount, products, branchId]);
    
    const handleCountChange = (sku: string, value: string) => {
        if (!countData) return;
        const newItems = countData.items.map(item =>
            item.sku === sku ? { ...item, countedQuantity: value === '' ? null : parseInt(value, 10) } : item
        );
        setCountData({ ...countData, items: newItems });
    };
    
    const handleSaveProgress = () => {
        if (!countData) return;
        onSave(countData);
    };

    const handleCompleteCount = () => {
        if (!countData) return;
        if (window.confirm('Are you sure you want to complete this count? This will adjust all product stock levels to match the counted quantities.')) {
            // Set uncounted items to their expected quantity
            const finalItems = countData.items.map(item => ({
                ...item,
                countedQuantity: item.countedQuantity === null ? item.expectedQuantity : item.countedQuantity,
            }));
            
            const finalCount = { ...countData, items: finalItems, status: 'Completed' as const };
            onSave(finalCount);
        }
    };

    if (!countData) {
        return null;
    }
    
    const isCompleted = countData.status === 'Completed';

    return (
        <Modal title={stockCount ? `Stock Count ${stockCount.id}` : 'New Stock Count'} onClose={onClose}>
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                <div className="text-sm">
                    <p><strong>Date:</strong> {countData.date}</p>
                    <p><strong>Status:</strong> {countData.status}</p>
                </div>
                <div className="overflow-x-auto -mx-6">
                    <table className="w-full text-sm">
                        <thead className="bg-background text-text-secondary text-left">
                            <tr>
                                <th className="px-4 py-2">Product</th>
                                <th className="px-4 py-2 text-center">Expected</th>
                                <th className="px-4 py-2 text-center">Counted</th>
                                <th className="px-4 py-2 text-center">Discrepancy</th>
                            </tr>
                        </thead>
                        <tbody>
                            {countData.items.map(item => {
                                const discrepancy = (item.countedQuantity ?? item.expectedQuantity) - item.expectedQuantity;
                                return (
                                <tr key={item.sku} className="border-b border-border">
                                    <td className="px-4 py-2">
                                        <div className="font-medium text-text-primary">{item.productName}</div>
                                        <div className="text-xs text-text-secondary">SKU: {item.sku}</div>
                                    </td>
                                    <td className="px-4 py-2 text-center">{item.expectedQuantity}</td>
                                    <td className="px-4 py-2">
                                        <input
                                            type="number"
                                            value={item.countedQuantity ?? ''}
                                            onChange={e => handleCountChange(item.sku, e.target.value)}
                                            disabled={isCompleted}
                                            className="w-24 text-center bg-surface border border-border rounded-md px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary disabled:bg-background"
                                            placeholder="Enter count..."
                                        />
                                    </td>
                                    <td className={`px-4 py-2 text-center font-bold ${discrepancy > 0 ? 'text-green-500' : discrepancy < 0 ? 'text-red-500' : 'text-text-secondary'}`}>
                                        {discrepancy > 0 ? `+${discrepancy}` : discrepancy}
                                    </td>
                                </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
            {!isCompleted && (
                <div className="p-4 bg-background rounded-b-xl flex justify-between items-center border-t border-border">
                    <button type="button" onClick={handleSaveProgress} className="bg-border hover:bg-border/70 text-text-primary font-semibold py-2 px-4 rounded-lg text-sm">Save Progress</button>
                    <div className="flex gap-2">
                        <button type="button" onClick={onClose} className="bg-border hover:bg-border/70 text-text-primary font-semibold py-2 px-4 rounded-lg text-sm">Cancel</button>
                        <button type="button" onClick={handleCompleteCount} className="bg-primary hover:bg-primary-dark text-white font-semibold py-2 px-4 rounded-lg text-sm">Complete Count & Adjust Stock</button>
                    </div>
                </div>
            )}
        </Modal>
    );
};

export default StockCountModal;