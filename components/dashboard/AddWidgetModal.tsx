import React from 'react';
import Modal from '../ui/Modal';
import { PlusCircle } from 'lucide-react';
import { WidgetId } from '../../types';

interface AddWidgetModalProps {
  availableWidgets: { id: WidgetId; name: string }[];
  currentWidgetIds: WidgetId[];
  onAdd: (widgetId: WidgetId) => void;
  onClose: () => void;
}

const AddWidgetModal: React.FC<AddWidgetModalProps> = ({ availableWidgets, currentWidgetIds, onAdd, onClose }) => {
  const widgetsToAdd = availableWidgets.filter(w => !currentWidgetIds.includes(w.id));

  return (
    <Modal title="Add Widget to Dashboard" onClose={onClose}>
      <div className="p-6 max-h-[60vh] overflow-y-auto">
        {widgetsToAdd.length > 0 ? (
          <div className="space-y-3">
            {widgetsToAdd.map(widget => (
              <div key={widget.id} className="bg-background p-3 rounded-lg border border-border flex justify-between items-center">
                <p className="font-semibold text-text-primary">{widget.name}</p>
                <button
                  onClick={() => onAdd(widget.id)}
                  className="flex items-center gap-2 bg-primary/20 text-primary font-semibold py-2 px-3 rounded-lg text-sm hover:bg-primary/40 transition-colors"
                  title={`Add ${widget.name}`}
                >
                  <PlusCircle size={16}/> Add
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-text-secondary py-10">All available widgets are already on your dashboard.</p>
        )}
      </div>
       <div className="p-4 bg-background rounded-b-xl flex justify-end">
        <button type="button" onClick={onClose} className="bg-border hover:bg-border/70 text-text-primary font-semibold py-2 px-4 rounded-lg text-sm">Done</button>
      </div>
    </Modal>
  );
};

export default AddWidgetModal;
