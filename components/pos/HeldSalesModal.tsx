
import React from 'react';
import { HeldSale } from '../../types';
import Modal from '../ui/Modal';
import { Trash2, PlusCircle, Archive } from 'lucide-react';

interface HeldSalesModalProps {
  heldSales: HeldSale[];
  onClose: () => void;
  onRestore: (saleId: string) => void;
  onDelete: (saleId: string) => void;
}

const HeldSalesModal: React.FC<HeldSalesModalProps> = ({ heldSales, onClose, onRestore, onDelete }) => {
  return (
    <Modal title="Held Sales" onClose={onClose}>
      <div className="p-6 max-h-[60vh] overflow-y-auto">
        {heldSales.length > 0 ? (
          <div className="space-y-4">
            {heldSales.map(sale => {
              const itemCount = sale.items.reduce((sum, item) => sum + item.quantity, 0);
              return (
                <div key={sale.id} className="bg-background p-4 rounded-lg border border-border flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-text-primary">
                      {itemCount} item{itemCount > 1 ? 's' : ''} - ${sale.total.toFixed(2)}
                    </p>
                    <p className="text-xs text-text-secondary">
                      Held at: {new Date(sale.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => onRestore(sale.id)}
                      className="flex items-center gap-2 bg-primary/20 text-primary font-semibold py-2 px-3 rounded-lg text-sm hover:bg-primary/40 transition-colors"
                      title="Restore to Cart"
                    >
                        <PlusCircle size={16}/> Restore
                    </button>
                    <button 
                      onClick={() => onDelete(sale.id)}
                      className="p-2 text-red-400 hover:bg-red-900/50 rounded-lg transition-colors"
                      title="Delete Held Sale"
                    >
                        <Trash2 size={16}/>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <Archive size={48} className="text-text-secondary mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-text-primary">No Sales on Hold</h3>
            <p className="text-text-secondary">Use the 'Hold' button in the cart to save an order for later.</p>
          </div>
        )}
      </div>
      <div className="p-4 bg-background rounded-b-xl flex justify-end">
        <button type="button" onClick={onClose} className="bg-border hover:bg-border/70 text-text-primary font-semibold py-2 px-4 rounded-lg text-sm">Close</button>
      </div>
    </Modal>
  );
};

export default HeldSalesModal;
