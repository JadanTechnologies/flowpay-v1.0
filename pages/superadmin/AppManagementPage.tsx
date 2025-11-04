import React from 'react';
import { Construction, Zap } from 'lucide-react';

const AppManagementPage: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center h-full text-center p-4">
            <Construction className="text-secondary animate-pulse" size={64} />
            <h1 className="mt-8 text-4xl font-bold text-text-primary">App Management Coming Soon!</h1>
            <p className="mt-4 text-lg text-text-secondary max-w-lg">
                We're hard at work building a powerful new module for one-click app deployments, updates, and mobile build management. Stay tuned!
            </p>
            <div className="mt-8 flex items-center justify-center gap-2 text-text-secondary">
                <Zap className="text-primary animate-ping opacity-75" size={16} />
                <span>FlowPay Engineering</span>
            </div>
            <div className="mt-4 w-full max-w-md bg-surface rounded-full h-2.5">
                <div className="bg-primary h-2.5 rounded-full w-1/4 animate-pulse"></div>
            </div>
        </div>
    );
};

export default AppManagementPage;