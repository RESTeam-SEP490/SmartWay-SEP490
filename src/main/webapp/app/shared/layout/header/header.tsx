import './header.scss';

import { DesktopOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { AUTHORITIES } from 'app/config/constants';
import { useAppSelector } from 'app/config/store';
import NavigateByAuthorities from 'app/modules/login/navigate-by-authorities';
import { hasAnyAuthority } from 'app/shared/auth/private-route';
import React, { useState } from 'react';
import LoadingBar from 'react-redux-loading-bar';
import { useLocation } from 'react-router-dom';
import { AccountMenu, AuthenticatedAccountMenu, LocaleMenu } from '../menus';
import { Brand } from './header-components';

export const MainAppHeader = () => {
  const location = useLocation();

  return (
    <div className={location.pathname.includes('register') ? 'hidden' : location.pathname === '/' ? 'bg-gray-100' : ''}>
      <div className="flex items-center justify-between pt-4 pb-2 mx-auto transition-all duration-300 ease-linear lg:max-w-7xl">
        <Brand />
        <div className="flex items-center gap-10">
          <LocaleMenu />
          <AccountMenu />
        </div>
      </div>
    </div>
  );
};

export const TenantAppHeader = () => {
  const { authorities } = useAppSelector(state => state.authentication.account);

  const [isNavigate, setIsNavigate] = useState(false);

  if (isNavigate) return <NavigateByAuthorities to="pos" />;

  return (
    <div className={'bg-white border-0 border-solid border-b border-slate-200'}>
      {/* {renderDevRibbon()} */}
      <LoadingBar className="loading-bar" />
      <div className="">
        <div className="flex items-center justify-between py-2 pl-4 pr-12">
          <Brand />
          <div
            className="flex items-center gap-10"
            hidden={
              !hasAnyAuthority(authorities, [
                AUTHORITIES.BILL_FULL_ACCESS,
                AUTHORITIES.BILL_VIEW_ONLY,
                AUTHORITIES.KITCHEN_PREPARING_ITEM,
                AUTHORITIES.KITCHEN_RTS_ITEM,
                AUTHORITIES.ORDER_ADD_AND_CANCEL,
                AUTHORITIES.ADMIN,
              ])
            }
          >
            <Button type="primary" icon={<DesktopOutlined rev={''} />} onClick={() => setIsNavigate(true)}>
              POS Screen
            </Button>
            <LocaleMenu />
            <AuthenticatedAccountMenu />
          </div>
        </div>
      </div>
    </div>
  );
};
