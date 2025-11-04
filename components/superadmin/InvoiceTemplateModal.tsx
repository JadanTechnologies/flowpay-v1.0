import React, { useState } from 'react';
import { InvoiceTemplate, InvoiceItem } from '../../types';
import Modal from '../ui/Modal';
import { PlusCircle, Trash2 } from 'lucide-react';

interface InvoiceTemplateModalProps {
    template: InvoiceTemplate | null;
    onSave: (template: InvoiceTemplate) => void;
    onClose: () => void;
}

const InvoiceTemplateModal: React.FC<InvoiceTemplateModalProps> = ({ template, onSave, onClose }) => {
    const [name, setName] = useState(template?.name || '');
    const [items, setItems] = useState<InvoiceItem[]>(template?.defaultItems || []);
    const [notes, setNotes] = useState(template?.notes || '');

    const handleItemChange = (index: number, field: keyof InvoiceItem, value: string | number) => {
        const newItems = [...items];
        // @ts-ignore
        newItems[index][field] = value;
        setItems(newItems);
    };

    const addItem = () => {
        setItems([...items, { description: '', quantity: 1, unitPrice: 0 }]);
    };

    const removeItem = (index: number) => {
        setItems(items.filter((_, i) => i !== index));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            id: template?.id || '',
            name,
            defaultItems: items,
            notes,
        });
    };

    return (
        <Modal title={template ? 'Edit Invoice Template' : 'Create New Template'} onClose={onClose}>
            <form onSubmit={handleSubmit}>
                <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                    <div>
                        <label className="text-sm text-text-secondary block mb-1">Template Name</label>
                        <input type="text" value={name} onChange={e => setName(e.target.value)} required className="w-full bg-background border border-border rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary text-sm" />
                    </div>

                    <div>
                        <label className="text-sm text-text-secondary block mb-2">Default Line Items</label>
                        <div className="space-y-2">
                            {items.map((item, index) => (
                                <div key={index} className="flex items-center gap-2 bg-background p-2 rounded-md border border-border">
                                    <input type="text" placeholder="Description" value={item.description} onChange={e => handleItemChange(index, 'description', e.target.value)} className="flex-grow bg-surface border-border rounded-md px-2 py-1 text-sm"/>
                                    <input type="number" placeholder="Qty" value={item.quantity} onChange={e => handleItemChange(index, 'quantity', parseFloat(e.target.value) || 0)} className="w-20 bg-surface border-border rounded-md px-2 py-1 text-sm"/>
                                    <input type="number" placeholder="Price" value={item.unitPrice} onChange={e => handleItemChange(index, 'unitPrice', parseFloat(e.target.value) || 0)} className="w-24 bg-surface border-border rounded-md px-2 py-1 text-sm"/>
                                    <button type="button" onClick={() => removeItem(index)}><Trash2 size={16} className="text-red-400"/></button>
                                </div>
                            ))}
                        </div>
                        <button type="button" onClick={addItem} className="mt-2 flex items-center gap-1 text-sm text-primary hover:underline">
                            <PlusCircle size={14}/> Add Item
                        </button>
                    </div>
                     <div>
                        <label className="text-sm text-text-secondary block mb-1">Default Notes</label>
                        <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3} className="w-full bg-background border border-border rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary text-sm" />
                    </div>
                </div>
                <div className="p-4 bg-background rounded-b-xl flex justify-end gap-2">
                    <button type="button" onClick={onClose} className="bg-border hover:bg-border/70 text-text-primary font-semibold py-2 px-4 rounded-lg text-sm">Cancel</button>
                    <button type="submit" className="bg-primary hover:bg-primary-dark text-white font-semibold py-2 px-4 rounded-lg text-sm">Save Template</button>
                </div>
            </form>
        </Modal>
    );
};

export default InvoiceTemplateModal;