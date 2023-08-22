import { AUTHORITIES } from 'app/config/constants';
import { useAppSelector } from 'app/config/store';
import { IRestaurant } from 'app/shared/model/restaurant.model';
import React from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export const NavigateAfterLogin = () => {
  let path = '';
  const appType = useAppSelector(state => state.applicationProfile.appType);
  const restaurant: IRestaurant = useAppSelector(state => state.restaurant.restaurant);
  const authorities = useAppSelector(state => state.authentication.account.authorities);
  const navigate = useNavigate();

  useEffect(() => {
    if (appType === 'tenant' && Object.keys(restaurant).length > 0) {
      console.log(restaurant);
      if (restaurant.isNew) path = '/first-time-setting';
      else if (authorities.includes(AUTHORITIES.ADMIN)) path = '/managing/dashboard';
      else if (authorities.includes(AUTHORITIES.STAFF_VIEW)) path = '/managing/staff';
      else if (authorities.includes(AUTHORITIES.MENUITEM_VIEW)) path = '/managing/menu-items';
      else if (authorities.includes(AUTHORITIES.TABLE_VIEW)) path = '/managing/tables';
      else if (authorities.includes(AUTHORITIES.BILL_VIEW)) path = '/managing/bills';
      else if (authorities.includes(AUTHORITIES.ORDER_WAITER)) path = '/pos/orders';
      navigate(path);
    }
  }, [restaurant]);

  return <></>;
};

export default NavigateAfterLogin;
