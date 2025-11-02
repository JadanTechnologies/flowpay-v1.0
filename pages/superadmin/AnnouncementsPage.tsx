import React, { useState } from 'react';
import { Announcement } from '../../types';
import { announcements as mockAnnouncements } from '../../data/mockData';
import Table, { Column } from '../../components/ui/Table';
import { Megaphone, PlusCircle, Edit, Trash2 } from 'lucide-react';
import AnnouncementModal from '../../components/superadmin/AnnouncementModal';

const getStatusBadge = (status: Announcement['status']) => {
    switch (status) {
        case 'published': return <span className="px-2 py-1 text-xs font-medium text-green-300 bg-green-900 rounded-full">{status}</span>;
        case 'draft': return <span className="px-2 py-1 text-xs font-medium text-gray-300 bg-gray-700 rounded-full">{status}</span>;
    }
};

const getTypeBadge = (type: Announcement['type']) => {
    switch (type) {
        case 'info': return <span className="px-2 py-1 text-xs font-medium text-blue-300 bg-blue-900 rounded-full">{type}</span>;
        case 'warning': return <span className="px-2 py-1 text-xs font-medium text-yellow-300 bg-yellow-900 rounded-full">{type}</span>;
        case 'success': return <span className="px-2 py-1 text-xs font-medium text-green-300 bg-green-900 rounded-full">{type}</span>;
    }
}

const AnnouncementsPage: React.FC = () => {
    const [announcements, setAnnouncements] = useState<Announcement[]>(mockAnnouncements);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);

    const openModalForNew = () => {
        setEditingAnnouncement(null);
        setIsModalOpen(true);
    };

    const openModalForEdit = (announcement: Announcement) => {
        setEditingAnnouncement(announcement);
        setIsModalOpen(true);
    };

    const handleSave = (announcement: Announcement) => {
        if (editingAnnouncement) {
            setAnnouncements(prev => prev.map(a => a.id === announcement.id ? announcement : a));
        } else {
            const newAnnouncement = { ...announcement, id: `ann_${new Date().getTime()}` };
            setAnnouncements(prev => [newAnnouncement, ...prev]);
        }
        setIsModalOpen(false);
    };
    
    const handleDelete = (id: string) => {
        if (window.confirm('Are you sure you want to delete this announcement?')) {
            setAnnouncements(prev => prev.filter(a => a.id !== id));
        }
    };

    const columns: Column<Announcement>[] = [
        { header: 'Title', accessor: 'title', sortable: true },
        { header: 'Type', accessor: 'type', render: (row) => getTypeBadge(row.type) },
        { header: 'Status', accessor: 'status', render: (row) => getStatusBadge(row.status) },
        { header: 'Publish Date', accessor: 'publishDate', sortable: true },
        {
            header: 'Actions',
            accessor: 'actions',
            render: (row) => (
                <div className="flex gap-2">
                    <button onClick={() => openModalForEdit(row)} className="p-1.5 hover:bg-border rounded-md"><Edit size={14} /></button>
                    <button onClick={() => handleDelete(row.id)} className="p-1.5 hover:bg-border rounded-md"><Trash2 size={14} className="text-red-400" /></button>
                </div>
            )
        }
    ];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-text-primary">Announcements</h1>
                <button onClick={openModalForNew} className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-semibold py-2 px-4 rounded-lg transition-colors">
                    <PlusCircle size={16} /> Create Announcement
                </button>
            </div>
            <div className="bg-surface border border-border rounded-xl p-6 shadow-lg">
                <Table columns={columns} data={announcements} />
            </div>

            {isModalOpen && (
                <AnnouncementModal
                    announcement={editingAnnouncement}
                    onSave={handleSave}
                    onClose={() => setIsModalOpen(false)}
                />
            )}
        </div>
    );
};

export default AnnouncementsPage;