


import React from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import SuperAdminSidebar from '../components/superadmin/SuperAdminSidebar';
import SuperAdminHeader from '../components/superadmin/SuperAdminHeader';
import { useAppContext } from '../contexts/AppContext';

const SuperAdminLayout: React.FC = () => {
  const { session, loading } = useAppContext();
  const location = useLocation();

  if (loading) {
      return (
          <div className="flex h-screen w-full items-center justify-center bg-background">
              <div className="text-text-primary">Loading...</div>
          </div>
      );
  }
  
  if (!session) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  if (session.user?.app_metadata?.role !== 'super_admin') {
      console.warn("User is not a super admin, redirecting.");
      return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return (
    <div className="flex h-screen bg-background text-text-primary font-sans">
      <SuperAdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <SuperAdminHeader />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default SuperAdminLayout;