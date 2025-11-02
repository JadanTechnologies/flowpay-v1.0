import React, { useState, useMemo } from 'react';
import { Sale, CartItem } from '../../types';
import Modal from '../ui/Modal';
import { Search, X, Plus, Minus, Package, AlertTriangle } from 'lucide-react';
import { formatCurrency } from '../../utils/formatting';
import { useAppContext } from '../../contexts/AppContext';

interface ReturnModalProps {
    salesHistory: Sale[];
    onClose: () => void;
    onRequestReturn: (returnedItems: CartItem[], originalSale: Sale) => void;
}

const ReturnModal: React.FC<ReturnModalProps> = ({ salesHistory, onClose, onRequestReturn }) => {
    const [saleIdSearch, setSaleIdSearch] = useState('');
    const [searchedSale, setSearchedSale] = useState<Sale | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [itemsToReturn, setItemsToReturn] = useState<Record<string, number>>({});
    const { currency } = useAppContext();

    const handleFindSale = () => {
        setError(null);
        setSearchedSale(null);
        setItemsToReturn({});
        const foundSale = salesHistory.find(s => s.id === saleIdSearch);
        if (foundSale) {
            if(foundSale.status === 'Refunded' || foundSale.amount < 0) {
                 setError('This is a refund transaction and cannot be refunded again.');
                 return;
            }
            setSearchedSale(foundSale);
        } else {
            setError('Sale ID not found. Please check the receipt and try again.');
        }
    };
    
    const handleQuantityChange = (productId: string, purchasedQuantity: number, change: number) => {
        setItemsToReturn(prev => {
            const currentQty = prev[productId] || 0;
            const newQty = Math.max(0, Math.min(purchasedQuantity, currentQty + change));
            return { ...prev, [productId]: newQty };
        });
    };
    
    const totalRefund = useMemo(() => {
        if (!searchedSale) return 0;
        // FIX: Explicitly cast `quantity` to number as Object.entries can return [string, unknown][].
        return Object.entries(itemsToReturn).reduce((sum, [productId, quantity]) => {
            const item = searchedSale.items.find(i => i.id === productId);
            return sum + (item ? item.price * (quantity as number) : 0);
        }, 0);
    }, [itemsToReturn, searchedSale]);

    const handleConfirmRefund = () => {
        if (!searchedSale) return;

        const returnedItems: CartItem[] = Object.entries(itemsToReturn)
            // FIX: Explicitly cast `quantity` to number for comparison.
            .filter(([, quantity]) => (quantity as number) > 0)
            .map(([productId, quantity]) => {
                const originalItem = searchedSale.items.find(i => i.id === productId)!;
                // FIX: Explicitly cast `quantity` to number for assignment.
                return { ...originalItem, quantity: quantity as number };
            });

        if (returnedItems.length === 0) {
            alert("No items selected for return.");
            return;
        }

        onRequestReturn(returnedItems, searchedSale);
    };

    return (
        <Modal title="Process Customer Return" onClose={onClose}>
            <div className="p-6">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={saleIdSearch}
                        onChange={e => setSaleIdSearch(e.target.value)}
                        placeholder="Enter Sale ID from receipt (e.g., sale_1)"
                        className="flex-grow bg-background border border-border rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <button onClick={handleFindSale} className="flex items-center justify-center gap-2 bg-primary text-white font-semibold py-2 px-4 rounded-lg hover:bg-primary-dark transition-colors">
                        <Search size={16} /> Find Sale
                    </button>
                </div>

                {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
            </div>
            
            {searchedSale && (
                <div className="border-t border-border">
                    <div className="p-6 space-y-4 max-h-[50vh] overflow-y-auto">
                        <h3 className="font-bold text-lg text-text-primary">Original Sale Details</h3>
                        <div className="text-sm space-y-1 text-text-secondary">
                            <p><strong>Customer:</strong> {searchedSale.customerName}</p>
                            <p><strong>Date:</strong> {new Date(searchedSale.date).toLocaleString()}</p>
                            <p><strong>Total:</strong> {formatCurrency(searchedSale.amount, currency)}</p>
                        </div>
                         <h4 className="font-semibold text-text-primary pt-2 border-t border-border">Select items to return:</h4>
                         <div className="space-y-3">
                             {searchedSale.items.map(item => (
                                 <div key={item.id} className="flex items-center bg-background p-3 rounded-md border border-border">
                                     <img src={item.imageUrl} alt={item.name} className="w-12 h-12 object-cover rounded-md mr-3" />
                                     <div className="flex-1">
                                        <p className="text-sm font-medium text-text-primary">{item.name}</p>
                                        <p className="text-xs text-text-secondary">Purchased: {item.quantity} @ {formatCurrency(item.price, currency)}</p>
                                     </div>
                                      <div className="flex items-center gap-2">
                                        <button onClick={() => handleQuantityChange(item.id, item.quantity, -1)} className="p-1 rounded-full bg-surface hover:bg-border"><Minus size={12} /></button>
                                        <span className="font-bold w-4 text-center">{itemsToReturn[item.id] || 0}</span>
                                        <button onClick={() => handleQuantityChange(item.id, item.quantity, 1)} className="p-1 rounded-full bg-surface hover:bg-border"><Plus size={12} /></button>
                                    </div>
                                 </div>
                             ))}
                         </div>
                    </div>
                     <div className="p-4 bg-background rounded-b-xl border-t border-border">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-xl font-bold text-text-primary">Total Refund:</span>
                            <span className="text-2xl font-bold text-primary">{formatCurrency(totalRefund, currency)}</span>
                        </div>
                        <button 
                            onClick={handleConfirmRefund} 
                            disabled={totalRefund <= 0}
                            className="w-full bg-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-primary-dark transition-colors disabled:bg-gray-700 disabled:text-text-secondary disabled:cursor-not-allowed"
                        >
                            Request Manager Approval
                        </button>
                    </div>
                </div>
            )}

            {!searchedSale && !error && (
                 <div className="text-center py-12 border-t border-border">
                    <Package size={48} className="text-text-secondary mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-text-primary">Find a Sale to Begin</h3>
                    <p className="text-text-secondary">Enter the transaction ID to load items for a return.</p>
                </div>
            )}
        </Modal>
    );
};

export default ReturnModal;