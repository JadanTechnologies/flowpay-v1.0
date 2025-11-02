import React, { useState, useMemo } from 'react';
import { EmailSmsTemplate } from '../../types';
import { emailSmsTemplates as mockTemplates } from '../../data/mockData';
import Tabs from '../../components/ui/Tabs';
import TemplateEditor from '../../components/superadmin/TemplateEditor';
import { Mail, MessageSquare } from 'lucide-react';

const TemplatesPage: React.FC = () => {
    const [templates, setTemplates] = useState<EmailSmsTemplate[]>(mockTemplates);
    const [activeTab, setActiveTab] = useState<'email' | 'sms'>('email');
    const [selectedTemplate, setSelectedTemplate] = useState<EmailSmsTemplate | null>(null);

    const filteredTemplates = useMemo(() => {
        const sorted = templates.filter(t => t.type === activeTab).sort((a, b) => a.name.localeCompare(b.name));
        if (!selectedTemplate || selectedTemplate.type !== activeTab) {
            setSelectedTemplate(sorted[0] || null);
        }
        return sorted;
    }, [templates, activeTab]);

    const handleSave = (updatedTemplate: EmailSmsTemplate) => {
        setTemplates(prev => prev.map(t => t.id === updatedTemplate.id ? updatedTemplate : t));
        setSelectedTemplate(updatedTemplate);
        alert('Template saved successfully!');
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-text-primary">Email & SMS Templates</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1">
                    <div className="bg-surface border border-border rounded-xl p-4">
                         <Tabs
                            tabs={[
                                { id: 'email', label: 'Email', icon: <Mail size={16} /> },
                                { id: 'sms', label: 'SMS', icon: <MessageSquare size={16} /> },
                            ]}
                            activeTab={activeTab}
                            setActiveTab={(id) => {
                                setActiveTab(id as 'email' | 'sms');
                                setSelectedTemplate(null); // Reset selection on tab change
                            }}
                        />
                        <nav className="mt-4 space-y-1">
                            {filteredTemplates.map(template => (
                                <button
                                    key={template.id}
                                    onClick={() => setSelectedTemplate(template)}
                                    className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                                        selectedTemplate?.id === template.id ? 'bg-primary/20 text-primary' : 'hover:bg-background text-text-secondary'
                                    }`}
                                >
                                    {template.name}
                                </button>
                            ))}
                        </nav>
                    </div>
                </div>
                <div className="md:col-span-2">
                    {selectedTemplate ? (
                        <TemplateEditor 
                            key={selectedTemplate.id} // Re-mount component on template change
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
        </div>
    );
};

export default TemplatesPage;