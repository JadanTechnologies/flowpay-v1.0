import React from 'react';
import { CartItem } from '../../types';
import { Plus, Minus, X, Trash2, Hand, CreditCard, Archive, Handshake, RotateCcw } from 'lucide-react';
import { useAppContext } from '../../contexts/AppContext';
import { formatCurrency } from '../../utils/formatting';

interface CartProps {
  cart: CartItem[];
  dispatch: React.Dispatch<any>;
  subtotal: number;
  tax: number;
  total: number;
  onClear: () => void;
  onHold: () => void;
  onPayment: () => void;
  onReturn: () => void;
  heldSalesCount: number;
  onOpenHeldSales: () => void;
  onChargeToAccount: () => void;
}

const Cart: React.FC<CartProps> = ({ cart, dispatch, subtotal, tax, total, onClear, onHold, onPayment, onReturn, heldSalesCount, onOpenHeldSales, onChargeToAccount }) => {
  const { currency } = useAppContext();
  const isCartEmpty = cart.length === 0;
  
  const handleQuantityChange = (id: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  };

  const handleDiscountChange = (id: string, value: string) => {
    const discountAmount = parseFloat(value) || 0;
    const item = cart.find(i => i.id === id);
    if (!item) return;

    if (discountAmount < 0) return;

    const maxDiscount = item.price * item.quantity;
    const finalDiscount = Math.min(discountAmount, maxDiscount);

    dispatch({ type: 'UPDATE_DISCOUNT', payload: { id, discount: finalDiscount } });
  };
  
  const handleRemoveItem = (id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id });
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-text-primary">Current Order</h2>
        <button 
          onClick={onOpenHeldSales}
          className="relative flex items-center gap-2 text-sm bg-surface hover:bg-border text-text-secondary font-semibold py-1 px-3 rounded-lg transition-colors border border-border"
        >
          <Archive size={16} />
          <span>On Hold</span>
          {heldSalesCount > 0 && (
            <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-secondary text-xs font-bold text-background">
              {heldSalesCount}
            </span>
          )}
        </button>
      </div>

      {cart.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-text-secondary">
          <p>Your cart is empty.</p>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto pr-2 -mr-2">
          {cart.map(item => (
            <div key={item.id} className="flex items-center mb-3">
              <img src={item.imageUrl} alt={item.name} className="w-12 h-12 object-cover rounded-md mr-3" />
              <div className="flex-1">
                <p className="text-sm font-medium text-text-primary">{item.name}</p>
                <div className="flex items-center gap-2 text-xs text-text-secondary">
                    <span>{formatCurrency(item.price, currency)}</span>
                    <span className="text-gray-500">•</span>
                    <span>Stock: {item.stock}</span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                    <label htmlFor={`discount-${item.id}`} className="text-xs text-text-secondary">Discount:</label>
                    <input
                        id={`discount-${item.id}`}
                        type="number"
                        value={item.discount || ''}
                        onChange={e => handleDiscountChange(item.id, e.target.value)}
                        className="w-20 bg-surface border border-border rounded-md px-2 py-0.5 text-xs text-right focus:ring-1 focus:ring-primary focus:outline-none"
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                    />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => handleQuantityChange(item.id, item.quantity - 1)} className="p-1 rounded-full bg-background hover:bg-border"><Minus size={12} /></button>
                <span className="font-bold w-4 text-center">{item.quantity}</span>
                <button onClick={() => handleQuantityChange(item.id, item.quantity + 1)} className="p-1 rounded-full bg-background hover:bg-border disabled:opacity-50 disabled:cursor-not-allowed" disabled={item.quantity >= item.stock}><Plus size={12} /></button>
              </div>
               <button onClick={() => handleRemoveItem(item.id)} className="ml-3 text-red-500 hover:text-red-400"><X size={16} /></button>
            </div>
          ))}
        </div>
      )}
      <div className="mt-auto pt-4 border-t border-border">
        <div className="space-y-2 text-sm mb-4">
          <div className="flex justify-between">
            <span className="text-text-secondary">Subtotal</span>
            <span className="font-medium text-text-primary">{formatCurrency(subtotal, currency)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-secondary">Tax (8%)</span>
            <span className="font-medium text-text-primary">{formatCurrency(tax, currency)}</span>
          </div>
          <div className="flex justify-between text-lg font-bold">
            <span className="text-text-primary">Total</span>
            <span className="text-primary">{formatCurrency(total, currency)}</span>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 mb-2">
           <button onClick={onHold} disabled={isCartEmpty} className="w-full flex items-center justify-center gap-2 bg-yellow-600/20 text-yellow-400 font-semibold py-2 px-4 rounded-lg hover:bg-yellow-600/40 transition-colors disabled:bg-gray-800 disabled:text-text-secondary disabled:cursor-not-allowed">
            <Hand size={16} /> Hold
          </button>
           <button onClick={onReturn} className="w-full flex items-center justify-center gap-2 bg-blue-600/20 text-blue-400 font-semibold py-2 px-4 rounded-lg hover:bg-blue-600/40 transition-colors">
            <RotateCcw size={16} /> Return
          </button>
          <button onClick={onClear} disabled={isCartEmpty} className="w-full flex items-center justify-center gap-2 bg-red-600/20 text-red-400 font-semibold py-2 px-4 rounded-lg hover:bg-red-600/40 transition-colors disabled:bg-gray-800 disabled:text-text-secondary disabled:cursor-not-allowed">
            <Trash2 size={16} /> Clear
          </button>
        </div>
        <div className="flex flex-col gap-2">
            <button
                onClick={onChargeToAccount}
                disabled={isCartEmpty}
                className="w-full flex items-center justify-center gap-2 bg-blue-600/20 text-blue-400 font-semibold py-3 px-4 rounded-lg hover:bg-blue-600/40 transition-colors disabled:bg-gray-800 disabled:text-text-secondary disabled:cursor-not-allowed"
            >
                <Handshake size={18} /> Charge to Account
            </button>
            <button onClick={onPayment} disabled={isCartEmpty} className="w-full flex items-center justify-center gap-2 bg-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-primary-dark transition-colors disabled:bg-primary/50 disabled:cursor-not-allowed">
                <CreditCard size={18} /> Pay Now
            </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;