import React from 'react';
import { PendingReturnRequest } from '../../types';
import Modal from '../ui/Modal';
import { formatCurrency } from '../../utils/formatting';
import { useAppContext } from '../../contexts/AppContext';
import { Check, X, User, Calendar, Hash } from 'lucide-react';

interface ReturnApprovalModalProps {
  requests: PendingReturnRequest[];
  onClose: () => void;
  onApprove: (requestId: string) => void;
  onReject: (requestId: string) => void;
}

const ReturnApprovalModal: React.FC<ReturnApprovalModalProps> = ({ requests, onClose, onApprove, onReject }) => {
  const { currency } = useAppContext();

  return (
    <Modal title="Pending Return Approvals" onClose={onClose}>
      <div className="p-6 max-h-[70vh] overflow-y-auto space-y-4">
        {requests.length > 0 ? (
          requests.map(request => (
            <div key={request.id} className="bg-background p-4 rounded-lg border border-border">
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-bold text-text-primary">
                    {formatCurrency(request.totalRefundAmount, currency)} Refund
                  </div>
                  <div className="text-xs text-text-secondary mt-1 space-y-0.5">
                    <p className="flex items-center gap-1"><User size={12}/>Requested by: {request.cashierName}</p>
                    <p className="flex items-center gap-1"><Calendar size={12}/>On: {new Date(request.timestamp).toLocaleString()}</p>
                    <p className="flex items-center gap-1"><Hash size={12}/>Original Sale ID: {request.originalSale.id}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onApprove(request.id)}
                    className="flex items-center gap-2 bg-green-600/20 text-green-400 font-semibold py-2 px-3 rounded-lg text-sm hover:bg-green-600/40 transition-colors"
                  >
                    <Check size={16}/> Approve
                  </button>
                  <button
                    onClick={() => onReject(request.id)}
                    className="flex items-center gap-2 bg-red-600/20 text-red-400 font-semibold py-2 px-3 rounded-lg text-sm hover:bg-red-600/40 transition-colors"
                  >
                    <X size={16}/> Reject
                  </button>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-border/50">
                <p className="text-xs font-semibold text-text-secondary mb-1">Items to be returned:</p>
                <ul className="text-xs space-y-1">
                  {request.itemsToReturn.map(item => (
                    <li key={item.id} className="flex justify-between">
                      <span>{item.name} (Qty: {item.quantity})</span>
                      <span>{formatCurrency(item.price * item.quantity, currency)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-text-secondary py-10">No pending return requests for this branch.</p>
        )}
      </div>
      <div className="p-4 bg-background rounded-b-xl flex justify-end">
        <button type="button" onClick={onClose} className="bg-border hover:bg-border/70 text-text-primary font-semibold py-2 px-4 rounded-lg text-sm">Close</button>
      </div>
    </Modal>
  );
};

export default ReturnApprovalModal;
