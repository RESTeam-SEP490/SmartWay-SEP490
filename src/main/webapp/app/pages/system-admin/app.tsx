import { AdminAppRoutes, MainAppRoutes } from 'app/routes';
import ErrorBoundary from 'app/shared/error/error-boundary';
import { AdminAppHeader, MainAppHeader, TenantAppHeader } from 'app/shared/layout/header/header';
import React from 'react';
import { useLocation } from 'react-router-dom';

export const AdminApp = () => {
  const appLocation = useLocation();

  return (
    <div className="flex flex-col w-screen min-h-screen">
      {!['login'].some(key => appLocation.pathname.includes(key)) && (
        <ErrorBoundary>
          <AdminAppHeader />
        </ErrorBoundary>
      )}
      <div className="flex flex-col grow">
        <ErrorBoundary>
          <AdminAppRoutes />
        </ErrorBoundary>
      </div>
    </div>
  );
};

export default AdminApp;
