import React from 'react';
import { Navigate, Route } from 'react-router-dom';

import { Spin } from 'antd';
import { AUTHORITIES } from 'app/config/constants';
import Activate from 'app/modules/account/activate/activate';
import PasswordResetFinish from 'app/modules/account/password-reset/finish/password-reset-finish';
import PasswordResetInit from 'app/modules/account/password-reset/init/password-reset-init';
import Register from 'app/modules/account/register/register';
import Home from 'app/modules/home/home';
import Login from 'app/modules/login/login';
import Logout from 'app/modules/login/logout';
import { TenantProfileForm } from 'app/pages/tenant/management/tenant-profile/tenant-profile-form';
import PrivateRoute from 'app/shared/auth/private-route';
import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';
import PageNotFound from 'app/shared/error/page-not-found';
import RestaurantSetting from './pages/tenant/restaurant-setting/restaurant';
import Loadable from 'react-loadable';

const loading = (
  <div className="flex items-center justify-center grow">
    <Spin tip="Loading" size="large">
      <div className="content" />
    </Spin>
  </div>
);

const Account = Loadable({ loader: () => import('app/modules/account'), loading: () => loading });

// const Admin = Loadable({
//   loader: () => import(/* webpackChunkName: "admin" */ 'app/pages/admin'),
//   loading: () => loading,
// });

const Setup = Loadable({ loader: () => import('app/pages/tenant/routes'), loading: () => loading });
const POS = Loadable({ loader: () => import('app/pages/tenant/selling/routes'), loading: () => loading });

export const MainAppRoutes = () => {
  return (
    <ErrorBoundaryRoutes>
      <Route index element={<Home />} />
      <Route path="register" element={<Register />} />
      <Route path="*" element={<PageNotFound />} />
    </ErrorBoundaryRoutes>
  );
};

export const TenantAppRoutes = () => {
  return (
    <ErrorBoundaryRoutes>
      <Route index element={<Navigate to={'login'} />} />
      <Route path="login" element={<Login />} />
      <Route path="logout" element={<Logout />} />
      <Route path="profile" element={<TenantProfileForm />} />
      <Route
        path="restaurant-setting"
        element={
          <PrivateRoute hasAnyAuthorities={[AUTHORITIES.ADMIN]}>
            <RestaurantSetting />
          </PrivateRoute>
        }
      />
      <Route path="account">
        <Route
          index
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
        path="managing/*"
        element={
          <PrivateRoute hasAnyAuthorities={[AUTHORITIES.USER, AUTHORITIES.ADMIN]}>
            <Setup />
          </PrivateRoute>
        }
      ></Route>
      <Route
        path="pos/*"
        element={
          <PrivateRoute hasAnyAuthorities={[AUTHORITIES.USER, AUTHORITIES.ADMIN]}>
            <POS />
          </PrivateRoute>
        }
      ></Route>

      <Route path="*" element={<PageNotFound />} />
    </ErrorBoundaryRoutes>
  );
};

export const AdminAppRoutes = () => {
  return (
    <ErrorBoundaryRoutes>
      <Route path="login" element={<Login />} />
      <Route path="logout" element={<Logout />} />
      <Route
        path="account"
        element={
          <PrivateRoute hasAnyAuthorities={[AUTHORITIES.SYSTEM_ADMIN]}>
            <Account />
          </PrivateRoute>
        }
      />
      {/* <Route path="*" element={<PrivateRoute hasAnyAuthorities={[AUTHORITIES.SYSTEM_ADMIN]}><Admin /></PrivateRoute>} /> */}
    </ErrorBoundaryRoutes>
  );
};
