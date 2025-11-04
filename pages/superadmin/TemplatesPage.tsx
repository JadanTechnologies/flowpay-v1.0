import React, { useState, useMemo } from 'react';
import { EmailSmsTemplate, InvoiceTemplate } from '../../types';
import { emailSmsTemplates as mockTemplates } from '../../data/mockData';
import Tabs from '../../components/ui/Tabs';
import TemplateEditor from '../../components/superadmin/TemplateEditor';
import { Mail, MessageSquare, FileText, PlusCircle, Edit, Trash2 } from 'lucide-react';
import { useAppContext } from '../../contexts/AppContext';
import InvoiceTemplateModal from '../../components/superadmin/InvoiceTemplateModal';

const TemplatesPage: React.FC = () => {
    const { emailSmsTemplates, setInvoiceTemplates, invoiceTemplates } = useAppContext();
    const [activeTab, setActiveTab] = useState<'email' | 'sms' | 'invoice'>('email');
    const [selectedTemplate, setSelectedTemplate] = useState<EmailSmsTemplate | null>(null);
    const [selectedInvoiceTemplate, setSelectedInvoiceTemplate] = useState<InvoiceTemplate | null>(null);
    const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);

    const filteredTemplates = useMemo(() => {
        const templatesToFilter = activeTab === 'invoice' ? [] : emailSmsTemplates;
        const sorted = templatesToFilter.filter(t => t.type === activeTab).sort((a, b) => a.name.localeCompare(b.name));
        
        if(activeTab !== 'invoice'){
             if (!selectedTemplate || selectedTemplate.type !== activeTab) {
                setSelectedTemplate(sorted[0] || null);
            }
        }
        return sorted;
    }, [emailSmsTemplates, activeTab, selectedTemplate]);

    const handleSave = (updatedTemplate: EmailSmsTemplate) => {
        // In a real app, you'd call an API here.
        alert('Template saved successfully!');
    };
    
    const handleSaveInvoiceTemplate = (template: InvoiceTemplate) => {
        if (selectedInvoiceTemplate) {
            setInvoiceTemplates(prev => prev.map(t => t.id === template.id ? template : t));
        } else {
            const newTemplate = { ...template, id: `inv_tmpl_${Date.now()}` };
            setInvoiceTemplates(prev => [newTemplate, ...prev]);
        }
        setIsInvoiceModalOpen(false);
    };

    const handleDeleteInvoiceTemplate = (id: string) => {
        if (window.confirm('Are you sure you want to delete this invoice template?')) {
            setInvoiceTemplates(prev => prev.filter(t => t.id !== id));
        }
    };


    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-text-primary">Templates</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1">
                    <div className="bg-surface border border-border rounded-xl p-4">
                         <Tabs
                            tabs={[
                                { id: 'email', label: 'Email', icon: <Mail size={16} /> },
                                { id: 'sms', label: 'SMS', icon: <MessageSquare size={16} /> },
                                { id: 'invoice', label: 'Invoices', icon: <FileText size={16} /> },
                            ]}
                            activeTab={activeTab}
                            setActiveTab={(id) => {
                                setActiveTab(id as 'email' | 'sms' | 'invoice');
                                setSelectedTemplate(null); 
                            }}
                        />
                        <nav className="mt-4 space-y-1">
                             {activeTab !== 'invoice' ? filteredTemplates.map(template => (
                                <button
                                    key={template.id}
                                    onClick={() => setSelectedTemplate(template)}
                                    className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                                        selectedTemplate?.id === template.id ? 'bg-primary/20 text-primary' : 'hover:bg-background text-text-secondary'
                                    }`}
                                >
                                    {template.name}
                                </button>
                            )) : (
                                <div className="space-y-2">
                                    {invoiceTemplates.map(template => (
                                        <div key={template.id} className="w-full text-left px-3 py-2 rounded-md text-sm font-medium bg-background border border-border flex justify-between items-center">
                                            <span>{template.name}</span>
                                            <div className="flex gap-2">
                                                <button onClick={() => { setSelectedInvoiceTemplate(template); setIsInvoiceModalOpen(true); }}><Edit size={14} className="text-text-secondary hover:text-primary"/></button>
                                                <button onClick={() => handleDeleteInvoiceTemplate(template.id)}><Trash2 size={14} className="text-text-secondary hover:text-red-400"/></button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </nav>
                    </div>
                </div>
                <div className="md:col-span-2">
                    {activeTab === 'invoice' ? (
                        <div className="bg-surface border border-border rounded-xl p-6 h-full flex flex-col items-center justify-center text-center">
                            <FileText size={48} className="text-text-secondary mb-4"/>
                            <h2 className="text-xl font-bold">Invoice Template Management</h2>
                            <p className="text-text-secondary mt-2">Create and manage reusable invoice templates for tenants.</p>
                            <button onClick={() => { setSelectedInvoiceTemplate(null); setIsInvoiceModalOpen(true); }} className="mt-4 flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-semibold py-2 px-4 rounded-lg transition-colors">
                                <PlusCircle size={16} /> Create New Template
                            </button>
                        </div>
                    ) : selectedTemplate ? (
                        <TemplateEditor 
                            key={selectedTemplate.id}
                            template={selectedTemplate} 
                            onSave={handleSave} 
                        />
                    ) : (
                        <div className="bg-surface border border-border rounded-xl p-6 h-full flex items-center justify-center text-text-secondary">
                            Select a template to edit.
                        </div>
                    )}
                </div>
            </div>
            {isInvoiceModalOpen && (
                <InvoiceTemplateModal
                    template={selectedInvoiceTemplate}
                    onSave={handleSaveInvoiceTemplate}
                    onClose={() => setIsInvoiceModalOpen(false)}
                />
            )}
        </div>
    );
};

export default TemplatesPage;