import React, { useState } from 'react';
import { Announcement } from '../../types';
import Modal from '../ui/Modal';

interface AnnouncementModalProps {
    announcement: Announcement | null;
    onSave: (announcement: Announcement) => void;
    onClose: () => void;
}

const AnnouncementModal: React.FC<AnnouncementModalProps> = ({ announcement, onSave, onClose }) => {
    const [formData, setFormData] = useState<Omit<Announcement, 'id'>>(announcement || {
        title: '',
        content: '',
        type: 'info',
        publishDate: new Date().toISOString().split('T')[0],
        status: 'draft'
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ ...formData, id: announcement?.id || '' });
    };

    return (
        <Modal title={announcement ? 'Edit Announcement' : 'Create New Announcement'} onClose={onClose}>
            <form onSubmit={handleSubmit}>
                <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                    <input type="text" name="title" placeholder="Title" value={formData.title} onChange={handleChange} required className="w-full bg-background border border-border rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary text-sm" />
                    <textarea name="content" placeholder="Content (supports Markdown)" value={formData.content} onChange={handleChange} required rows={5} className="w-full bg-background border border-border rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary text-sm" />
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm text-text-secondary block mb-1">Type</label>
                            <select name="type" value={formData.type} onChange={handleChange} className="w-full bg-background border border-border rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary text-sm">
                                <option value="info">Info</option>
                                <option value="success">Success</option>
                                <option value="warning">Warning</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-sm text-text-secondary block mb-1">Status</label>
                            <select name="status" value={formData.status} onChange={handleChange} className="w-full bg-background border border-border rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary text-sm">
                                <option value="draft">Draft</option>
                                <option value="published">Published</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div className="p-4 bg-background rounded-b-xl flex justify-end gap-2">
                    <button type="button" onClick={onClose} className="bg-border hover:bg-border/70 text-text-primary font-semibold py-2 px-4 rounded-lg text-sm">Cancel</button>
                    <button type="submit" className="bg-primary hover:bg-primary-dark text-white font-semibold py-2 px-4 rounded-lg text-sm">Save Announcement</button>
                </div>
            </form>
        </Modal>
    );
};

export default AnnouncementModal;