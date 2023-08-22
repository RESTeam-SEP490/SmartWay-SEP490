import { useAppDispatch, useAppSelector } from 'app/config/store';
import { TenantAppRoutes } from 'app/routes';
import ErrorBoundary from 'app/shared/error/error-boundary';
import { TenantAppHeader } from 'app/shared/layout/header/header';
import React, { useEffect } from 'react';
import { getRestaurantInfo } from './restaurant-setting/restaurant.reducer';

export const TenantApp = () => {
  const dispatch = useAppDispatch();

  const isAuthenticated = useAppSelector(state => state.authentication.isAuthenticated);

  useEffect(() => {
    if (isAuthenticated) dispatch(getRestaurantInfo());
  }, [isAuthenticated]);

  return (
    <div className="flex flex-col w-screen min-h-screen">
      <ErrorBoundary>
        <TenantAppHeader />
      </ErrorBoundary>
      <div className="flex flex-col grow">
        <ErrorBoundary>
          <TenantAppRoutes />
        </ErrorBoundary>
      </div>
    </div>
  );
};
