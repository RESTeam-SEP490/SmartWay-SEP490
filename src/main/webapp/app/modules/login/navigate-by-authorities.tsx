import { AUTHORITIES } from 'app/config/constants';
import { useAppSelector } from 'app/config/store';
import { IRestaurant } from 'app/shared/model/restaurant.model';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const NavigateByAuthorities = ({ to }: { to?: 'pos' | 'managing' }) => {
  let path = '';
  const appType = useAppSelector(state => state.applicationProfile.appType);
  const restaurant: IRestaurant = useAppSelector(state => state.restaurant.restaurant);
  const authorities = useAppSelector(state => state.authentication.account.authorities);
  const username = useAppSelector(state => state.authentication.account.username);
  const navigate = useNavigate();

  useEffect(() => {
    if (appType === 'tenant' && Object.keys(restaurant).length > 0) {
      if (to === 'managing' || !to) {
        if (restaurant.isNew) path = '/first-time-setting';
        else if (authorities.some(p => [AUTHORITIES.ADMIN, AUTHORITIES.DASHBOARD].includes(p))) path = '/managing/dashboard';
        else if (authorities.includes(AUTHORITIES.STAFFROLE)) path = '/managing/roles';
        else if (authorities.includes(AUTHORITIES.STAFF)) path = '/managing/staff';
        else if (authorities.includes(AUTHORITIES.MENUITEM)) path = '/managing/menu-items';
        else if (authorities.includes(AUTHORITIES.TABLE)) path = '/managing/tables';
      } else if (to === 'pos' || (!to && path === '')) {
        if (authorities.some(p => [AUTHORITIES.ORDER_ADD_AND_CANCEL, AUTHORITIES.ADMIN].includes(p))) path = '/pos/orders';
        else if ([AUTHORITIES.KITCHEN_PREPARING_ITEM, AUTHORITIES.KITCHEN_RTS_ITEM].some(p => authorities.includes(p)))
          path = '/pos/kitchen';
        else if ([AUTHORITIES.BILL_FULL_ACCESS, AUTHORITIES.BILL_VIEW_ONLY].some(p => authorities.includes(p))) path = '/pos/bills';
      }
    }
    navigate(path);
  }, [restaurant, authorities]);

  return <></>;
};

export default NavigateByAuthorities;
