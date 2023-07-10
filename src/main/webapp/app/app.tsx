import 'antd/dist/reset.css';
import 'app/config/dayjs.ts';
import 'react-toastify/dist/ReactToastify.css';
import '../content/css/app.css';
import '../output.css';

import React, { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';

import { App as AntApp, ConfigProvider, notification } from 'antd';
import { AUTHORITIES } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { hasAnyAuthority } from 'app/shared/auth/private-route';
import ErrorBoundary from 'app/shared/error/error-boundary';
import Header from 'app/shared/layout/header/header';
import { getProfile } from 'app/shared/reducers/application-profile';
import { getSession } from 'app/shared/reducers/authentication';
import Scrollbars from 'react-custom-scrollbars-2';
import { theme } from './config/ant-design-theme';
import { getApp } from './shared/util/subdomain/helpers';

const baseHref = document.querySelector('base').getAttribute('href').replace(/\/$/, '');

export const App = () => {
  const dispatch = useAppDispatch();
  const CurrentApp = getApp();

  useEffect(() => {
    dispatch(getSession());
    dispatch(getProfile());
  }, []);

  const currentLocale = useAppSelector(state => state.locale.currentLocale);
  const isAuthenticated = useAppSelector(state => state.authentication.isAuthenticated);
  const username = useAppSelector(state => state.authentication.account.username);
  const isAdmin = useAppSelector(state => hasAnyAuthority(state.authentication.account.authorities, [AUTHORITIES.SYSTEM_ADMIN]));
  const ribbonEnv = useAppSelector(state => state.applicationProfile.ribbonEnv);
  const isInProduction = useAppSelector(state => state.applicationProfile.inProduction);
  const isOpenAPIEnabled = useAppSelector(state => state.applicationProfile.isOpenAPIEnabled);
  notification.config({ placement: 'bottomRight' });
  return (
    <BrowserRouter basename={baseHref}>
      <Scrollbars className="!w-screen !h-screen">
        <ConfigProvider theme={theme}>
          <AntApp>
            <ToastContainer position={toast.POSITION.TOP_RIGHT} className="toastify-container" toastClassName="toastify-toast" />
            <div className="flex flex-col min-h-screen">
              <ErrorBoundary>
                <Header
                  isAuthenticated={isAuthenticated}
                  isAdmin={isAdmin}
                  currentLocale={currentLocale}
                  ribbonEnv={ribbonEnv}
                  isInProduction={isInProduction}
                  isOpenAPIEnabled={isOpenAPIEnabled}
                  username={username}
                />
              </ErrorBoundary>
              <div className="px-4 bg-gray-100 grow">
                <ErrorBoundary>
                  <CurrentApp />
                </ErrorBoundary>
                {/* <Footer /> */}
              </div>
            </div>
          </AntApp>
        </ConfigProvider>
      </Scrollbars>
    </BrowserRouter>
  );
};

export default App;
