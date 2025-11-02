
import React from 'react';
// FIX: The `react-router-dom` module seems to have CJS/ESM interop issues in this environment. Using a namespace import as a workaround.
import * as ReactRouterDOM from 'react-router-dom';
const { Outlet, Navigate, useLocation } = ReactRouterDOM;
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
  
  // It's good practice to check for a specific super admin role.
  // Assuming 'super_admin' role is set in Supabase user app_metadata.
  if (session.user.app_metadata.role !== 'super_admin') {
      console.warn("User is not a super admin, redirecting.");
      // This could also be a silent sign out + redirect
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