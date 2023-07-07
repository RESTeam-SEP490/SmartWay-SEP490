import './header.scss';

import React, { useState } from 'react';
import { Storage, Translate } from 'react-jhipster';
import LoadingBar from 'react-redux-loading-bar';
import { useLocation } from 'react-router-dom';
import { AccountMenu, AdminMenu, LocaleMenu } from '../menus';
import { UserMenu } from '../menus/main-menu';
import { Brand } from './header-components';

export interface IHeaderProps {
  username?: string;
  isAuthenticated: boolean;
  isAdmin: boolean;
  ribbonEnv: string;
  isInProduction: boolean;
  isOpenAPIEnabled: boolean;
  currentLocale: string;
}

const Header = (props: IHeaderProps) => {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(Storage.session.get('isCollapsed', false));

  const renderDevRibbon = () =>
    props.isInProduction === false ? (
      <div className="ribbon dev">
        <a href="">
          <Translate contentKey={`global.ribbon.${props.ribbonEnv}`} />
        </a>
      </div>
    ) : null;

  const toggleCollapse = () => {
    Storage.session.set('isCollapsed', !isCollapsed);
    setIsCollapsed(prev => !prev);
  };

  return (
    <div
      className={
        ['login', 'register'].some(path => location.pathname.includes(path)) ? 'hidden' : props.isAuthenticated ? 'bg-white' : 'bg-gray-100'
      }
    >
      {/* {renderDevRibbon()} */}
      <LoadingBar className="loading-bar" />
      <div
        className={
          (isCollapsed ? 'h-0 overflow-hidden pt-0 pb-0' : 'pt-4 pb-2') +
          ' mx-auto lg:max-w-7xl flex justify-between items-center transition-all duration-300 ease-linear'
        }
      >
        <Brand />
        <div className="flex gap-10 items-center">
          {props.isAdmin && (
            <ul className="list-none">
              <AdminMenu showOpenAPI={true} />
            </ul>
          )}
          <LocaleMenu currentLocale={props.currentLocale} />
          <AccountMenu name={props.username} isAuthenticated={props.isAuthenticated} />
        </div>
      </div>

      {props.isAuthenticated && !props.isAdmin && <UserMenu onCollapse={toggleCollapse} isCollapsed={isCollapsed} />}
    </div>
  );
};

export default Header;
