import { useAppDispatch, useAppSelector } from 'app/config/store';
import { TenantAppRoutes } from 'app/routes';
import ErrorBoundary from 'app/shared/error/error-boundary';
import { TenantAppHeader } from 'app/shared/layout/header/header';
import { IRestaurant } from 'app/shared/model/restaurant.model';
import React, { useEffect } from 'react';
import { getRestaurantInfo, restaurantActions } from './restaurant-setting/restaurant.reducer';
import Subscription from './restaurant-setting/subscription';
import dayjs from 'dayjs';
import { useLocation } from 'react-router-dom';

export const TenantApp = () => {
  const dispatch = useAppDispatch();
  const appLocation = useLocation();

  const isAuthenticated = useAppSelector(state => state.authentication.isAuthenticated);
  const restaurant: IRestaurant = useAppSelector(state => state.restaurant.restaurant);

  useEffect(() => {
    if (isAuthenticated) dispatch(getRestaurantInfo());
  }, [isAuthenticated]);

  if (isAuthenticated && restaurant.planExpiry && dayjs(restaurant.planExpiry).isBefore(dayjs()))
    dispatch(restaurantActions.setIsShowSubsciptionModal(true));
  // if (restaurant.planExpiry && dayjs(restaurant.planExpiry).isBefore(dayjs())) return <></> ;

  return (
    <div className="flex flex-col w-screen min-h-screen">
      <LoadingOverlay />
      <Subscription />
      {!['login', 'pos', 'account/reset/request', 'account/reset/finish', 'first-time-setting'].some(key =>
        appLocation.pathname.includes(key)
      ) && (
        <ErrorBoundary>
          <TenantAppHeader />
        </ErrorBoundary>
      )}
      <div className="flex flex-col grow">
        <ErrorBoundary>
          <TenantAppRoutes />
        </ErrorBoundary>
      </div>
    </div>
  );
};

export const LoadingOverlay = () => {
  const loading1 = useAppSelector(state => state.menuItem.loading);
  const updating1 = useAppSelector(state => state.menuItem.updating);
  const loading2 = useAppSelector(state => state.diningTable.loading);
  const updating2 = useAppSelector(state => state.diningTable.updating);
  const loading3 = useAppSelector(state => state.zone.loading);
  const updating3 = useAppSelector(state => state.zone.updating);
  const loading4 = useAppSelector(state => state.statistic.loading);
  const loading5 = useAppSelector(state => state.staff.loading);
  const updating5 = useAppSelector(state => state.staff.updating);
  const loading6 = useAppSelector(state => state.role.loading);
  const updating6 = useAppSelector(state => state.role.updating);
  const loading7 = useAppSelector(state => state.restaurant.loading);
  const updating7 = useAppSelector(state => state.restaurant.updating);
  const loading8 = useAppSelector(state => state.tenant.loading);
  const updating8 = useAppSelector(state => state.tenant.updating);
  const loading9 = useAppSelector(state => state.register.loading);
  const loading10 = useAppSelector(state => state.order.loading);
  const updating10 = useAppSelector(state => state.order.updating);
  const loading = useAppSelector(state => state.kitchen.loading);
  const updating = useAppSelector(state => state.kitchen.updating);

  const isShow =
    loading1 ||
    updating1 ||
    loading2 ||
    updating2 ||
    loading3 ||
    updating3 ||
    loading4 ||
    updating5 ||
    loading5 ||
    updating6 ||
    loading6 ||
    updating7 ||
    loading7 ||
    updating8 ||
    loading8 ||
    loading9 ||
    updating10 ||
    loading10 ||
    loading ||
    updating;

  return (
    <div hidden={!isShow} className="fixed transition-opacity duration-1000 bg-white bg-opacity-70 top-0 bottom-0 left-0 right-0 z-[5000]">
      <div className="app-loading">
        <div className="image-loading"></div>
        <div className="lds-ellipsis">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    </div>
  );
};
