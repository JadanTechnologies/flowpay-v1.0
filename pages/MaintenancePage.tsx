import React from 'react';
import { Zap, ServerOff } from 'lucide-react';
import { useAppContext } from '../contexts/AppContext';

const MaintenancePage: React.FC = () => {
  const { settings } = useAppContext();
  const maintenanceMessage = settings?.maintenanceMessage || "We are currently undergoing scheduled maintenance. We'll be back shortly.";

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-text-primary p-4">
      <div className="text-center">
        <div className="flex justify-center items-center gap-2 mb-4">
          <Zap className="text-primary" size={40} />
          <span className="text-4xl font-bold">FlowPay</span>
        </div>
        <ServerOff size={64} className="text-secondary mx-auto my-8" />
        <h1 className="text-4xl font-bold text-text-primary mb-4">Under Maintenance</h1>
        <p className="text-lg text-text-secondary max-w-lg">
          {maintenanceMessage}
        </p>
         <p className="text-sm text-text-secondary mt-8">
            We apologize for any inconvenience. Please check back later.
        </p>
      </div>
    </div>
  );
};

export default MaintenancePage;