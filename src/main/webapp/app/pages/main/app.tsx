import { MainAppRoutes } from 'app/routes';
import ErrorBoundary from 'app/shared/error/error-boundary';
import { MainAppHeader } from 'app/shared/layout/header/header';
import React from 'react';
import { LoadingOverlay } from '../tenant/app';

export const MainApp = () => {
  return (
    <div className="flex flex-col w-screen min-h-screen">
      <LoadingOverlay />
      <ErrorBoundary>
        <MainAppHeader />
      </ErrorBoundary>
      <div className="flex flex-col grow">
        <ErrorBoundary>
          <MainAppRoutes />
        </ErrorBoundary>
      </div>
    </div>
  );
};

export default MainApp;
