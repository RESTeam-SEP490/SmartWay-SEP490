import React from 'react';
import Loadable from 'react-loadable';
import { Navigate, Route } from 'react-router-dom';

import { AUTHORITIES } from 'app/config/constants';
import Activate from 'app/modules/account/activate/activate';
import PasswordResetFinish from 'app/modules/account/password-reset/finish/password-reset-finish';
import PasswordResetInit from 'app/modules/account/password-reset/init/password-reset-init';
import Register from 'app/modules/account/register/register';
import Home from 'app/modules/home/home';
import Login from 'app/modules/login/login';
import Logout from 'app/modules/login/logout';
import PrivateRoute from 'app/shared/auth/private-route';
import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';
import PageNotFound from 'app/shared/error/page-not-found';
import Order from 'app/pages/tenant/selling/routes';
import { Spin } from 'antd';
import { CheckBankAccountTenantForm } from 'app/pages/tenant/check-bank-account-tenant/check-bank-account-tenant-form';
import { CheckBankAccountTenant } from 'app/pages/tenant/check-bank-account-tenant/check-bank-account-tenant';

const loading = (
  <div className="flex items-center justify-center grow">
    <Spin tip="Loading" size="large">
      <div className="content" />
    </Spin>
  </div>
);

const Account = Loadable({
  loader: () => import(/* webpackChunkName: "account" */ 'app/modules/account'),
  loading: () => loading,
});

// const Admin = Loadable({
//   loader: () => import(/* webpackChunkName: "admin" */ 'app/pages/admin'),
//   loading: () => loading,
// });

const Tenant = Loadable({
  loader: () => import(/* webpackChunkName: "tenant" */ 'app/pages/tenant/routes'),
  loading: () => loading,
});

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
      <Route path="bankAcount" element={<CheckBankAccountTenant />} />
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
            <Tenant />
          </PrivateRoute>
        }
      ></Route>
      <Route
        path="pos/*"
        element={
          <PrivateRoute hasAnyAuthorities={[AUTHORITIES.USER, AUTHORITIES.ADMIN]}>
            <Order />
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
