import React, { useState, useEffect } from 'react';
import { ScheduledJob, ScheduledJobTaskType, ScheduledJobConfig } from '../../types';
import Modal from '../ui/Modal';
import { useAppContext } from '../../contexts/AppContext';

interface JobModalProps {
    job: ScheduledJob | null;
    onSave: (job: ScheduledJob) => void;
    onClose: () => void;
}

const schedulePresets = {
    '0 * * * *': 'Every Hour',
    '0 21 * * *': 'Daily at 9 PM',
    '0 2 * * 0': 'Weekly on Sunday at 2 AM',
};

const JobModal: React.FC<JobModalProps> = ({ job, onSave, onClose }) => {
    const { session } = useAppContext();
    const [name, setName] = useState(job?.name || '');
    const [taskType, setTaskType] = useState<ScheduledJobTaskType>(job?.taskType || 'email_report');
    const [schedule, setSchedule] = useState(job?.schedule || '0 21 * * *');
    const [config, setConfig] = useState<ScheduledJobConfig>(job?.config || { recipientEmail: '', attachmentFormat: 'csv' });
    
    const [isCustomSchedule, setIsCustomSchedule] = useState(!Object.keys(schedulePresets).includes(job?.schedule || ''));

    useEffect(() => {
        // Reset config when task type changes, setting defaults
        if (taskType === 'email_report') {
            setConfig({ recipientEmail: '', reportType: 'daily_sales', attachmentFormat: 'csv' });
        } else if (taskType === 'low_stock_alert') {
            setConfig({ recipientEmail: '' });
        } else if (taskType === 'data_backup') {
            setConfig({ backupLocation: 's3_bucket', backupFormat: 'json' });
        }
        else {
            setConfig({});
        }
    }, [taskType]);

    const handleScheduleChange = (value: string) => {
        if (value === 'custom') {
            setIsCustomSchedule(true);
        } else {
            setIsCustomSchedule(false);
            setSchedule(value);
        }
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const finalJob: ScheduledJob = {
            id: job?.id || '',
            tenantId: job?.tenantId || session?.user.id || '',
            name,
            taskType,
            schedule,
            config,
            status: job?.status || 'active',
            lastRun: job?.lastRun || null,
            nextRun: job?.nextRun || 'Pending', // In real app, this would be calculated
        };
        onSave(finalJob);
    };

    return (
        <Modal title={job ? 'Edit Scheduled Job' : 'Create New Job'} onClose={onClose}>
            <form onSubmit={handleSubmit}>
                <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                    <div>
                        <label className="text-sm text-text-secondary block mb-1">Job Name</label>
                        <input type="text" value={name} onChange={e => setName(e.target.value)} required className="w-full bg-background border border-border rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary text-sm" />
                    </div>
                    <div>
                        <label className="text-sm text-text-secondary block mb-1">Task To Automate</label>
                        <select value={taskType} onChange={e => setTaskType(e.target.value as ScheduledJobTaskType)} className="w-full bg-background border border-border rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary text-sm">
                            <option value="email_report">Email a Report</option>
                            <option value="low_stock_alert">Send Low Stock Alert</option>
                            <option value="data_backup">Perform Data Backup</option>
                            <option value="credit_reminder">Send Credit Reminders</option>
                        </select>
                    </div>
                    
                    {/* Task-specific config */}
                    {taskType === 'email_report' && (
                        <div className="p-3 bg-background rounded-md border border-border space-y-3">
                            <h4 className="text-sm font-semibold">Report Options</h4>
                             <input type="email" placeholder="Recipient Email" value={config.recipientEmail} onChange={e => setConfig({...config, recipientEmail: e.target.value})} required className="w-full bg-surface border border-border rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary text-sm" />
                             <select value={config.reportType} onChange={e => setConfig({...config, reportType: e.target.value as any})} className="w-full bg-surface border border-border rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary text-sm">
                                <option value="daily_sales">Daily Sales Summary</option>
                                <option value="inventory_summary">Inventory Summary</option>
                            </select>
                            <select value={config.attachmentFormat || 'csv'} onChange={e => setConfig({ ...config, attachmentFormat: e.target.value as any })} className="w-full bg-surface border border-border rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary text-sm">
                                <option value="csv">CSV Attachment</option>
                                <option value="pdf">PDF Attachment</option>
                            </select>
                        </div>
                    )}
                     {taskType === 'low_stock_alert' && (
                        <div className="p-3 bg-background rounded-md border border-border">
                             <h4 className="text-sm font-semibold mb-2">Alert Options</h4>
                             <input type="email" placeholder="Recipient Email" value={config.recipientEmail} onChange={e => setConfig({...config, recipientEmail: e.target.value})} required className="w-full bg-surface border border-border rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary text-sm" />
                        </div>
                    )}
                     {taskType === 'data_backup' && (
                        <div className="p-3 bg-background rounded-md border border-border space-y-3">
                            <h4 className="text-sm font-semibold">Backup Options</h4>
                            <select value={config.backupLocation || 's3_bucket'} onChange={e => setConfig({ ...config, backupLocation: e.target.value as any })} className="w-full bg-surface border border-border rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary text-sm">
                                <option value="s3_bucket">S3 Bucket</option>
                                <option value="google_drive">Google Drive</option>
                                <option value="local_storage">Local Storage</option>
                            </select>
                             <select value={config.backupFormat || 'json'} onChange={e => setConfig({ ...config, backupFormat: e.target.value as any })} className="w-full bg-surface border border-border rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary text-sm">
                                <option value="json">JSON</option>
                                <option value="csv">CSV</option>
                                <option value="sql">SQL Dump</option>
                            </select>
                        </div>
                    )}
                    
                    <div>
                        <label className="text-sm text-text-secondary block mb-1">Schedule</label>
                         <select onChange={e => handleScheduleChange(e.target.value)} value={isCustomSchedule ? 'custom' : schedule} className="w-full bg-background border border-border rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary text-sm">
                            {Object.entries(schedulePresets).map(([cron, label]) => (
                                <option key={cron} value={cron}>{label}</option>
                            ))}
                            <option value="custom">Custom (Cron)</option>
                        </select>
                        {isCustomSchedule && (
                            <input
                                type="text"
                                value={schedule}
                                onChange={e => setSchedule(e.target.value)}
                                placeholder="* * * * *"
                                className="w-full mt-2 bg-background border border-border rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary text-sm font-mono"
                            />
                        )}
                    </div>
                </div>
                 <div className="p-4 bg-background rounded-b-xl flex justify-end gap-2">
                    <button type="button" onClick={onClose} className="bg-border hover:bg-border/70 text-text-primary font-semibold py-2 px-4 rounded-lg text-sm">Cancel</button>
                    <button type="submit" className="bg-primary hover:bg-primary-dark text-white font-semibold py-2 px-4 rounded-lg text-sm">Save Job</button>
                </div>
            </form>
        </Modal>
    );
};

export default JobModal;