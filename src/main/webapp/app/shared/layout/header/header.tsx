import './header.scss';

import React from 'react';
import { Translate } from 'react-jhipster';
import LoadingBar from 'react-redux-loading-bar';
import { Link, useLocation } from 'react-router-dom';
import { AccountMenu, AuthenticatedAccountMenu, LocaleMenu } from '../menus';
import { UserMenu } from '../menus/main-menu';
import { Brand, BrandIcon } from './header-components';
import { AppType } from 'app/app.constant';
import { Button } from 'antd';
import { DesktopOutlined } from '@ant-design/icons';

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
    <div
      className={
        ['login', 'pos'].some(key => location.pathname.includes(key))
          ? 'hidden'
          : 'bg-white border-0 border-solid border-b border-slate-200'
      }
    >
      {/* {renderDevRibbon()} */}
      <LoadingBar className="loading-bar" />
      <div className="">
        <div className="flex items-center justify-between py-2 pl-4 pr-12">
          <BrandIcon />
          <div className="flex items-center gap-10">
            <Button type="primary" icon={<DesktopOutlined rev={''} />}>
              <Link to={'/pos/orders'}>POS Screen</Link>
            </Button>
            <LocaleMenu currentLocale={props.currentLocale} />
            <AuthenticatedAccountMenu name={props.username} />
          </div>
        </div>
      </div>
    </div>
  );
};
