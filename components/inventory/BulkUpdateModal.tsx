import React from 'react';
import Modal from '../ui/Modal';
import { CheckCircle, XCircle } from 'lucide-react';

interface BulkUpdateResults {
    successCount: number;
    errors: string[];
}

interface BulkUpdateModalProps {
  results: BulkUpdateResults;
  onClose: () => void;
}

const BulkUpdateModal: React.FC<BulkUpdateModalProps> = ({ results, onClose }) => {
  return (
    <Modal title="Bulk Stock Update Results" onClose={onClose}>
        <div className="p-6 space-y-4">
            <div className="text-center">
                <h3 className="text-lg font-bold text-text-primary">Import Complete</h3>
                <p className="text-text-secondary">Your stock levels have been updated.</p>
            </div>
            
            <div className="bg-green-900/50 border border-green-700 p-4 rounded-lg flex items-center gap-4">
                <CheckCircle className="text-green-400" size={32} />
                <div>
                    <p className="font-bold text-green-300">{results.successCount} Products Updated</p>
                    <p className="text-sm text-green-400">Successfully updated stock quantities.</p>
                </div>
            </div>
            
            {results.errors.length > 0 && (
                <div className="bg-red-900/50 border border-red-700 p-4 rounded-lg">
                    <div className="flex items-center gap-4 mb-3">
                        <XCircle className="text-red-400" size={32} />
                        <div>
                            <p className="font-bold text-red-300">{results.errors.length} Errors Found</p>
                            <p className="text-sm text-red-400">These items were not updated. Please check the SKUs and values.</p>
                        </div>
                    </div>
                    <div className="max-h-40 overflow-y-auto bg-background p-2 rounded-md space-y-1">
                        {results.errors.map((error, index) => (
                            <p key={index} className="text-xs text-red-400 font-mono">
                                {error}
                            </p>
                        ))}
                    </div>
                </div>
            )}
        </div>
        <div className="p-4 bg-background rounded-b-xl flex justify-end">
            <button
                type="button"
                onClick={onClose}
                className="bg-primary hover:bg-primary-dark text-white font-semibold py-2 px-4 rounded-lg text-sm"
            >
                Close
            </button>
        </div>
    </Modal>
  );
};

export default BulkUpdateModal;
