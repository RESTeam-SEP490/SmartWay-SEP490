import './header.scss';

import React, { useState } from 'react';
import { Storage, Translate } from 'react-jhipster';
import LoadingBar from 'react-redux-loading-bar';
import { useLocation } from 'react-router-dom';
import { AccountMenu, AdminMenu, AuthenticatedAccountMenu, LocaleMenu } from '../menus';
import { UserMenu } from '../menus/main-menu';
import { Brand } from './header-components';
import { AppType } from 'app/app.constant';

export interface IHeaderProps {
  username?: string;
  isAuthenticated: boolean;
  isAdmin: boolean;
  ribbonEnv: string;
  isInProduction: boolean;
  isOpenAPIEnabled: boolean;
  currentLocale: string;
  appType: AppType;
}

const Header = (props: IHeaderProps) => {
  const location = useLocation();

  const renderDevRibbon = () =>
    props.isInProduction === false ? (
      <div className="ribbon dev">
        <a href="">
          <Translate contentKey={`global.ribbon.${props.ribbonEnv}`} />
        </a>
      </div>
    ) : null;

  return (
    <>
      {/* {props.appType === 'admin' && <AdminAppRoutes />} */}
      {props.appType === 'main' && <MainAppHeader {...props} />}
      {props.appType === 'tenant' && <TenantAppHeader {...props} />}
    </>
  );
};

export default Header;

const MainAppHeader = (props: IHeaderProps) => {
  return (
    <div className={location.pathname.includes('register') ? 'hidden' : location.pathname === '/' ? 'bg-gray-100' : ''}>
      {/* {renderDevRibbon()} */}
      <LoadingBar className="loading-bar" />
      <div className="flex items-center justify-between pt-4 pb-2 mx-auto transition-all duration-300 ease-linear lg:max-w-7xl">
        <Brand />
        <div className="flex items-center gap-10">
          <LocaleMenu currentLocale={props.currentLocale} />
          <AccountMenu />
        </div>
      </div>
    </div>
  );
};

const TenantAppHeader = (props: IHeaderProps) => {
  return (
    <div className={location.pathname.includes('login') ? 'hidden' : 'bg-white'}>
      {/* {renderDevRibbon()} */}
      <LoadingBar className="loading-bar" />
      <div className="flex items-center justify-between py-2 mx-auto transition-all duration-300 ease-linear lg:max-w-7xl">
        <Brand />
        <div className="flex items-center gap-10">
          <LocaleMenu currentLocale={props.currentLocale} />
          <AuthenticatedAccountMenu name={props.username} />
        </div>
      </div>
      {props.isAuthenticated && <UserMenu />}
    </div>
  );
};
