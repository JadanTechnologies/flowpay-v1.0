import React from 'react';
import { Sale } from '../../types';
import Modal from '../ui/Modal';
import { formatCurrency } from '../../utils/formatting';
import { useAppContext } from '../../contexts/AppContext';
import DetailedCashierSalesTable from './DetailedCashierSalesTable';
import DetailedCashierCreditSalesTable from './DetailedCashierCreditSalesTable';

interface CashierSalesDetailModalProps {
  title: string;
  sales: Sale[];
  type: 'general' | 'credit';
  onClose: () => void;
}

const CashierSalesDetailModal: React.FC<CashierSalesDetailModalProps> = ({ title, sales, type, onClose }) => {
  const { currency } = useAppContext();
  const totalAmount = sales.reduce((sum, sale) => sum + sale.amount, 0);

  return (
    <Modal title={title} onClose={onClose}>
      <div className="p-6 max-h-[70vh] overflow-y-auto">
        {sales.length > 0 ? (
          type === 'credit' ? <DetailedCashierCreditSalesTable sales={sales} /> : <DetailedCashierSalesTable sales={sales} />
        ) : (
          <p className="text-center text-text-secondary py-10">No transactions found for this category today.</p>
        )}
      </div>
      <div className="p-4 bg-background rounded-b-xl border-t border-border flex justify-between items-center">
        <span className="font-bold text-lg">Total</span>
        <span className="font-bold text-lg text-primary">{formatCurrency(totalAmount, currency)}</span>
      </div>
    </Modal>
  );
};

export default CashierSalesDetailModal;
