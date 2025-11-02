import React, { useState } from 'react';
import { EmailSmsTemplate } from '../../types';

interface TemplateEditorProps {
    template: EmailSmsTemplate;
    onSave: (template: EmailSmsTemplate) => void;
}

const placeholders = [
    '{{user_name}}', '{{tenant_name}}', '{{company_name}}', 
    '{{reset_link}}', '{{2fa_code}}', '{{invoice_id}}', '{{invoice_amount}}'
];

const TemplateEditor: React.FC<TemplateEditorProps> = ({ template, onSave }) => {
    const [subject, setSubject] = useState(template.subject || '');
    const [body, setBody] = useState(template.body);

    const handleSave = () => {
        onSave({ ...template, subject, body });
    };

    return (
        <div className="bg-surface border border-border rounded-xl shadow-lg">
            <div className="p-6 border-b border-border">
                <h2 className="text-xl font-bold text-text-primary">{template.name}</h2>
                <p className="text-sm text-text-secondary">Modify the content for this automated {template.type}.</p>
            </div>
            <div className="p-6 space-y-4">
                {template.type === 'email' && (
                    <div>
                        <label className="text-sm font-medium text-text-secondary block mb-1">Subject</label>
                        <input
                            type="text"
                            value={subject}
                            onChange={e => setSubject(e.target.value)}
                            className="w-full bg-background border border-border rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary text-sm"
                        />
                    </div>
                )}
                <div>
                    <label className="text-sm font-medium text-text-secondary block mb-1">Body</label>
                    <textarea
                        value={body}
                        onChange={e => setBody(e.target.value)}
                        rows={12}
                        className="w-full bg-background border border-border rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary text-sm font-mono"
                    />
                </div>
                <div>
                    <label className="text-sm font-medium text-text-secondary block mb-1">Available Placeholders</label>
                    <div className="flex flex-wrap gap-2 p-2 bg-background rounded-md border border-border">
                        {placeholders.map(p => (
                            <code key={p} className="text-xs text-secondary bg-surface px-2 py-1 rounded">{p}</code>
                        ))}
                    </div>
                </div>
            </div>
             <div className="p-4 bg-background rounded-b-xl flex justify-end">
                <button onClick={handleSave} className="bg-primary hover:bg-primary-dark text-white font-semibold py-2 px-6 rounded-lg transition-colors">
                    Save Template
                </button>
            </div>
        </div>
    );
};

export default TemplateEditor;