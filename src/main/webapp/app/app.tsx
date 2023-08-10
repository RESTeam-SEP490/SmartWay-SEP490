import 'antd/dist/reset.css';
import 'app/config/dayjs.ts';
import 'react-toastify/dist/ReactToastify.css';
import '../content/css/app.css';
import '../output.css';

import React, { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';

import { ConfigProvider, notification } from 'antd';
import { AUTHORITIES } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { hasAnyAuthority } from 'app/shared/auth/private-route';
import ErrorBoundary from 'app/shared/error/error-boundary';
import Header from 'app/shared/layout/header/header';
import { getProfile } from 'app/shared/reducers/application-profile';
import { getSession } from 'app/shared/reducers/authentication';
import Scrollbars from 'react-custom-scrollbars-2';
import { theme } from './config/ant-design-theme';
import { AdminAppRoutes, MainAppRoutes, TenantAppRoutes } from './routes';
import { getAppUrl } from './shared/util/subdomain/helpers';
import { getRestaurantInfo } from './pages/tenant/restaurant-setting/restaurant.reducer';

const baseHref = document.querySelector('base').getAttribute('href').replace(/\/$/, '');

export const App = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getSession());
    dispatch(getProfile());
  }, []);

  const appType = useAppSelector(state => state.applicationProfile.appType);
  const domain = useAppSelector(state => state.applicationProfile.domain);
  const isInProd = useAppSelector(state => state.applicationProfile.inProduction);
  if (appType == null) window.location.replace(getAppUrl(isInProd, 'www', domain, '/page-not-found'));

  const isAuthenticated = useAppSelector(state => state.authentication.isAuthenticated);
  const isAdmin = useAppSelector(state => hasAnyAuthority(state.authentication.account.authorities, [AUTHORITIES.SYSTEM_ADMIN]));
  const ribbonEnv = useAppSelector(state => state.applicationProfile.ribbonEnv);
  const isInProduction = useAppSelector(state => state.applicationProfile.inProduction);
  const isOpenAPIEnabled = useAppSelector(state => state.applicationProfile.isOpenAPIEnabled);

  notification.config({ placement: 'bottomLeft' });

  useEffect(() => {
    if (isAuthenticated) dispatch(getRestaurantInfo());
  }, [isAuthenticated]);

  return (
    <BrowserRouter basename={baseHref}>
      <Scrollbars className="!w-screen !h-screen">
        <ConfigProvider theme={theme}>
          <ToastContainer position={toast.POSITION.TOP_RIGHT} className="toastify-container" toastClassName="toastify-toast" />
          <div className="flex flex-col w-screen min-h-screen">
            <ErrorBoundary>
              <Header
                appType={appType}
                isAuthenticated={isAuthenticated}
                isAdmin={isAdmin}
                ribbonEnv={ribbonEnv}
                isInProduction={isInProduction}
                isOpenAPIEnabled={isOpenAPIEnabled}
              />
            </ErrorBoundary>
            <div className="flex flex-col grow">
              <ErrorBoundary>
                {appType === 'admin' && <AdminAppRoutes />}
                {appType === 'main' && <MainAppRoutes />}
                {appType === 'tenant' && <TenantAppRoutes />}
              </ErrorBoundary>
            </div>
          </div>
        </ConfigProvider>
      </Scrollbars>
    </BrowserRouter>
  );
};

export default App;
