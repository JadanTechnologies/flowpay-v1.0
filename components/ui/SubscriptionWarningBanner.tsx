import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
// FIX: The `react-router-dom` module seems to have CJS/ESM interop issues in this environment. Using a namespace import as a workaround.
import { Link } from 'react-router-dom';

interface SubscriptionWarningBannerProps {
  daysLeft: number;
  isTrial: boolean;
  onDismiss: () => void;
}

const SubscriptionWarningBanner: React.FC<SubscriptionWarningBannerProps> = ({ daysLeft, isTrial, onDismiss }) => {
  const message = isTrial 
    ? `Your trial expires in ${daysLeft} day${daysLeft > 1 ? 's' : ''}.` 
    : `Your subscription will expire in ${daysLeft} day${daysLeft > 1 ? 's' : ''}.`;

  return (
    <div className="bg-yellow-500 text-background font-bold p-3 flex items-center justify-center gap-4 text-sm z-50 no-print">
      <AlertTriangle size={20} />
      <span>{message} <Link to="/app/settings/manage-billing" className="underline hover:opacity-80">Update your billing information now to avoid service interruption.</Link></span>
      <button onClick={onDismiss} className="ml-auto p-1 rounded-full hover:bg-black/20">
        <X size={16} />
      </button>
    </div>
  );
};

export default SubscriptionWarningBanner;