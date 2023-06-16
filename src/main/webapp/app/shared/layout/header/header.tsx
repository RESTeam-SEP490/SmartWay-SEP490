import './header.scss';

import React, { useState } from 'react';
import { Storage, Translate } from 'react-jhipster';
import LoadingBar from 'react-redux-loading-bar';

import { useAppDispatch, useAppSelector } from 'app/config/store';
import { setLocale } from 'app/shared/reducers/locale';
import { useLocation } from 'react-router-dom';
import { AccountMenu, LocaleMenu } from '../menus';
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
  const fullName = useAppSelector(state => state.authentication.account.fullName);

  const location = useLocation();

  const renderDevRibbon = () =>
    props.isInProduction === false ? (
      <div className="ribbon dev">
        <a href="">
          <Translate contentKey={`global.ribbon.${props.ribbonEnv}`} />
        </a>
      </div>
    ) : null;

  /* jhipster-needle-add-element-to-menu - JHipster will add new menu items here */

  return (
    <div className={['login', 'register'].some(path => location.pathname.includes(path)) ? 'hidden' : ''}>
      {renderDevRibbon()}
      <LoadingBar className="loading-bar" />
      <div className="py-2 mx-auto lg:max-w-7xl flex justify-between items-center">
        <Brand />
        <div className="flex gap-10 items-center">
          <LocaleMenu currentLocale={props.currentLocale} />
          <AccountMenu name={fullName} isAuthenticated={props.isAuthenticated} />
        </div>
      </div>
      <div className="border-b border-blue-500 border-solid"></div>
      {props.isAuthenticated && <UserMenu />}
    </div>
  );
};

export default Header;
