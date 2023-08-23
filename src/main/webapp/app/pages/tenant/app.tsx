import { useAppDispatch, useAppSelector } from 'app/config/store';
import { TenantAppRoutes } from 'app/routes';
import ErrorBoundary from 'app/shared/error/error-boundary';
import { TenantAppHeader } from 'app/shared/layout/header/header';
import { IRestaurant } from 'app/shared/model/restaurant.model';
import React, { useEffect } from 'react';
import { getRestaurantInfo } from './restaurant-setting/restaurant.reducer';
import Subscription from './restaurant-setting/subscription';

export const TenantApp = () => {
  const dispatch = useAppDispatch();

  const isAuthenticated = useAppSelector(state => state.authentication.isAuthenticated);
  const restaurant: IRestaurant = useAppSelector(state => state.restaurant.restaurant);

  useEffect(() => {
    if (isAuthenticated) dispatch(getRestaurantInfo());
  }, [isAuthenticated]);

  // if (restaurant.planExpiry && dayjs(restaurant.planExpiry).isBefore(dayjs())) return <></> ;

  return (
    <div className="flex flex-col w-screen min-h-screen">
      <Subscription />
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
