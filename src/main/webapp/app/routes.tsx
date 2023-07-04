import React from 'react';
import Loadable from 'react-loadable';
import { Route, useLocation } from 'react-router-dom';

import { AUTHORITIES } from 'app/config/constants';
import { sendActivity } from 'app/config/websocket-middleware';
import Activate from 'app/modules/account/activate/activate';
import PasswordResetFinish from 'app/modules/account/password-reset/finish/password-reset-finish';
import PasswordResetInit from 'app/modules/account/password-reset/init/password-reset-init';
import Register from 'app/modules/account/register/register';
import Home from 'app/modules/home/home';
import Login from 'app/modules/login/login';
import Logout from 'app/modules/login/logout';
import ManagementRoutes from 'app/pages/user/management/routes';
import PrivateRoute from 'app/shared/auth/private-route';
import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';
import PageNotFound from 'app/shared/error/page-not-found';
import { useAppSelector } from './config/store';
import Header from './shared/layout/header/header';
import AdminLogin from './modules/login/admin-login';

const loading = <div>loading ...</div>;

const Account = Loadable({
  loader: () => import(/* webpackChunkName: "account" */ 'app/modules/account'),
  loading: () => loading,
});

const Admin = Loadable({
  loader: () => import(/* webpackChunkName: "administration" */ 'app/modules/administration'),
  loading: () => loading,
});

export const MainAppRoutes = () => {
  const isAuthenticated = useAppSelector(state => state.authentication.isAuthenticated);
  const location = useLocation();
  React.useEffect(() => {
    sendActivity(location.pathname);
  }, [location]);
  return (
    <ErrorBoundaryRoutes>
      {!isAuthenticated && <Route index element={<Home />} />}
      <Route path="login" element={<Login />} />
      <Route path="logout" element={<Logout />} />
      <Route path="register" element={<Register />} />

      <Route path="account">
        <Route
          path="*"
          element={
            <PrivateRoute hasAnyAuthorities={[AUTHORITIES.ADMIN, AUTHORITIES.USER]}>
              <Account />
            </PrivateRoute>
          }
        />
        <Route path="activate" element={<Activate />} />
        <Route path="reset">
          <Route path="request" element={<PasswordResetInit />} />
          <Route path="finish" element={<PasswordResetFinish />} />
        </Route>
      </Route>

      <Route
        path="*"
        element={
          <PrivateRoute hasAnyAuthorities={[AUTHORITIES.USER]}>
            <ManagementRoutes />
          </PrivateRoute>
        }
      />
      <Route path="*" element={<PageNotFound />} />
    </ErrorBoundaryRoutes>
  );
};

export const AdminAppRoutes = () => {
  return (
    <ErrorBoundaryRoutes>
      <Route path="login" element={<AdminLogin />} />
      <Route path="logout" element={<Logout />} />
      <Route
        path="account"
        element={
          <PrivateRoute hasAnyAuthorities={[AUTHORITIES.SYSTEM_ADMIN]}>
            <Account />
          </PrivateRoute>
        }
      />
      <Route
        path="*"
        element={
          <PrivateRoute hasAnyAuthorities={[AUTHORITIES.SYSTEM_ADMIN]}>
            <Admin />
          </PrivateRoute>
        }
      />
    </ErrorBoundaryRoutes>
  );
};
