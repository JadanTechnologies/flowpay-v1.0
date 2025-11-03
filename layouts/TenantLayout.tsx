

import React, { useMemo, useState, useEffect } from 'react';
// FIX: The `react-router-dom` module seems to have CJS/ESM interop issues in this environment. Using a namespace import as a workaround.
import * as ReactRouterDOM from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';
import useInactivityLogout from '../hooks/useInactivityLogout';
import { useAppContext } from '../contexts/AppContext';
import { ShieldAlert, LogOut } from 'lucide-react';
import NotificationContainer from '../components/ui/NotificationContainer';
import SubscriptionWarningBanner from '../components/ui/SubscriptionWarningBanner';

const TenantLayout: React.FC = () => {
  const { session, loading, settings, tenantSettings, userSubscription, addNotification } = useAppContext();
  
  const inactivityTimeout = tenantSettings?.inactivityLogoutTimer ?? settings?.inactivityLogoutTimer ?? 15;
  useInactivityLogout(inactivityTimeout * 60 * 1000, !!session); 

  const location = ReactRouterDOM.useLocation();
  const navigate = ReactRouterDOM.useNavigate();
  
  const [showSubscriptionWarning, setShowSubscriptionWarning] = useState(true);
  const [warningNotifSent, setWarningNotifSent] = useState(false);

  // Subscription warning logic
  const subscriptionWarning = useMemo(() => {
    if (!userSubscription) return null;

    const endDate = userSubscription.status === 'trial' ? userSubscription.trialEnds : userSubscription.nextBillingDate;
    if (!endDate) return null;

    const diff = new Date(endDate).getTime() - new Date().getTime();
    const daysLeft = Math.ceil(diff / (1000 * 60 * 60 * 24));

    if (daysLeft >= 0 && daysLeft <= 7) {
      return {
        daysLeft,
        isTrial: userSubscription.status === 'trial',
      };
    }

    return null;
  }, [userSubscription]);

  // Simulate in-app notification for subscription warning on initial load
  useEffect(() => {
    if (subscriptionWarning && !warningNotifSent) {
        const message = subscriptionWarning.isTrial 
            ? `Your trial is ending in ${subscriptionWarning.daysLeft} days.`
            : `Your subscription expires in ${subscriptionWarning.daysLeft} days.`;
        addNotification({
            message: `${message} Please update your billing details.`,
            type: 'warning',
            duration: 10000,
        });
        setWarningNotifSent(true);
    }
  }, [subscriptionWarning, addNotification, warningNotifSent]);

  if (loading) {
      return (
          <div className="flex h-screen w-full items-center justify-center bg-background">
              <div className="text-text-primary">Loading...</div>
          </div>
      );
  }

  if (!session) {
    return <ReactRouterDOM.Navigate to="/login" state={{ from: location }} replace />;
  }
  
  if (session.user.app_metadata.role === 'super_admin') {
    return <ReactRouterDOM.Navigate to="/admin/dashboard" replace />;
  }
  
  return (
    <div className="flex h-screen bg-background text-text-primary font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        {subscriptionWarning && showSubscriptionWarning && (
            <SubscriptionWarningBanner 
                daysLeft={subscriptionWarning.daysLeft}
                isTrial={subscriptionWarning.isTrial}
                onDismiss={() => setShowSubscriptionWarning(false)}
            />
        )}
        <NotificationContainer />
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background p-4 md:p-8">
          <ReactRouterDOM.Outlet />
        </main>
      </div>
    </div>
  );
};

export default TenantLayout;