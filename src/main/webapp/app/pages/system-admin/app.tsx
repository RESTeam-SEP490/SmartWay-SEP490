import { AdminAppRoutes, MainAppRoutes } from 'app/routes';
import ErrorBoundary from 'app/shared/error/error-boundary';
import { AdminAppHeader, MainAppHeader } from 'app/shared/layout/header/header';
import React from 'react';

export const AdminApp = () => {
  return (
    <div className="flex flex-col w-screen min-h-screen">
      <ErrorBoundary>
        <AdminAppHeader />
      </ErrorBoundary>
      <div className="flex flex-col grow">
        <ErrorBoundary>
          <AdminAppRoutes />
        </ErrorBoundary>
      </div>
    </div>
  );
};

export default AdminApp;
