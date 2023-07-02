import 'react-toastify/dist/ReactToastify.css';
import 'antd/dist/reset.css';
import '../content/css/app.css';
import '../output.css';
import 'app/config/dayjs.ts';

import React, { useEffect } from 'react';
import { Card } from 'reactstrap';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';

import { useAppDispatch, useAppSelector } from 'app/config/store';
import { getSession } from 'app/shared/reducers/authentication';
import { getProfile } from 'app/shared/reducers/application-profile';
import { setLocale } from 'app/shared/reducers/locale';
import Header from 'app/shared/layout/header/header';
import Footer from 'app/shared/layout/footer/footer';
import { hasAnyAuthority } from 'app/shared/auth/private-route';
import ErrorBoundary from 'app/shared/error/error-boundary';
import { AUTHORITIES } from 'app/config/constants';
import AppRoutes from 'app/routes';
import { ConfigProvider, message, notification, App as AntApp } from 'antd';
import { theme } from './config/ant-design-theme';
import { authenticate } from './shared/reducers/authentication';
import Scrollbars from 'react-custom-scrollbars-2';

const baseHref = document.querySelector('base').getAttribute('href').replace(/\/$/, '');

export const App = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getSession());
    dispatch(getProfile());
  }, []);

  const currentLocale = useAppSelector(state => state.locale.currentLocale);
  const isAuthenticated = useAppSelector(state => state.authentication.isAuthenticated);
  const isAdmin = useAppSelector(state => hasAnyAuthority(state.authentication.account.authorities, [AUTHORITIES.ADMIN]));
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
                />
              </ErrorBoundary>
              <div className="px-4 bg-gray-100 grow">
                <ErrorBoundary>
                  <AppRoutes />
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
