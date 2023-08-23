import { MainAppRoutes } from 'app/routes';
import ErrorBoundary from 'app/shared/error/error-boundary';
import { MainAppHeader } from 'app/shared/layout/header/header';
import React from 'react';

export const MainApp = () => {
  return (
    <div className="flex flex-col w-screen min-h-screen">
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
