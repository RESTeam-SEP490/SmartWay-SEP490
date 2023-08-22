import './header.scss';

import { DesktopOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { AppType } from 'app/app.constant';
import React from 'react';
import { Translate } from 'react-jhipster';
import LoadingBar from 'react-redux-loading-bar';
import { Link, useLocation } from 'react-router-dom';
import { AccountMenu, AuthenticatedAccountMenu, LocaleMenu } from '../menus';
import { Brand } from './header-components';

export interface IHeaderProps {
  isAuthenticated: boolean;
  isAdmin: boolean;
  ribbonEnv: string;
  isInProduction: boolean;
  isOpenAPIEnabled: boolean;
  appType: AppType;
}

const Header = (props: IHeaderProps) => {
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
      {props.appType === 'main' && <MainAppHeader />}
      {props.appType === 'tenant' && <TenantAppHeader />}
    </>
  );
};

export default Header;

export const MainAppHeader = () => {
  const location = useLocation();

  return (
    <div className={location.pathname.includes('register') ? 'hidden' : location.pathname === '/' ? 'bg-gray-100' : ''}>
      {/* {renderDevRibbon()} */}
      <LoadingBar className="loading-bar" />
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
  const location = useLocation();

  return (
    <div
      className={
        ['login', 'pos', 'account/reset/request', 'account/reset/finish', 'first-time-setting', 'subscription'].some(key =>
          location.pathname.includes(key)
        )
          ? 'hidden'
          : 'bg-white border-0 border-solid border-b border-slate-200'
      }
    >
      {/* {renderDevRibbon()} */}
      <LoadingBar className="loading-bar" />
      <div className="">
        <div className="flex items-center justify-between py-2 pl-4 pr-12">
          <Brand />
          <div className="flex items-center gap-10">
            <Link to={'/pos/orders'}>
              <Button type="primary" icon={<DesktopOutlined rev={''} />}>
                POS Screen
              </Button>
            </Link>
            <LocaleMenu />
            <AuthenticatedAccountMenu />
          </div>
        </div>
      </div>
    </div>
  );
};
