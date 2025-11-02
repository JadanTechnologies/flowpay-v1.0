import React from 'react';
import { useAppContext } from '../../contexts/AppContext';
import { Notification } from '../../types';
import { Bell, CheckCircle, AlertTriangle, XCircle, X } from 'lucide-react';

interface NotificationToastProps {
    notification: Notification;
    onDismiss: () => void;
}

const NotificationToast: React.FC<NotificationToastProps> = ({ notification, onDismiss }) => {
    const icons = {
        info: <Bell className="text-blue-300"/>,
        success: <CheckCircle className="text-green-300"/>,
        warning: <AlertTriangle className="text-yellow-300"/>,
        error: <XCircle className="text-red-300"/>,
    };
    const colors = {
        info: 'bg-blue-900/80 border-blue-700 text-blue-200',
        success: 'bg-green-900/80 border-green-700 text-green-200',
        warning: 'bg-yellow-900/80 border-yellow-700 text-yellow-200',
        error: 'bg-red-900/80 border-red-700 text-red-200',
    }

    return (
        <div className={`flex items-start p-4 w-96 max-w-sm rounded-lg shadow-lg border backdrop-blur-md animate-fade-in-right ${colors[notification.type]}`}>
            <div className="mr-3 pt-0.5">{icons[notification.type]}</div>
            <div className="flex-1 text-sm font-medium text-text-primary">{notification.message}</div>
            <button onClick={onDismiss} className="ml-4 -mr-1 -mt-1 p-1 rounded-full hover:bg-white/10">
                <X size={16} />
            </button>
        </div>
    )
}

const NotificationContainer: React.FC = () => {
    const { notifications, removeNotification } = useAppContext();

    if (notifications.length === 0) {
        return null;
    }

    return (
        <div className="fixed top-24 right-8 z-[100] space-y-3">
            {notifications.map(notif => (
                <NotificationToast key={notif.id} notification={notif} onDismiss={() => removeNotification(notif.id)} />
            ))}
        </div>
    );
};

export default NotificationContainer;
