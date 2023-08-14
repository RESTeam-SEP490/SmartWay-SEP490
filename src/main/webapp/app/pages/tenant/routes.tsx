import React from 'react';
import { Route } from 'react-router-dom';
import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';
import MenuItem from './management/menu-item/menu-item';
import { Staff } from './management/staff/staff';
import Role from './management/role/role';
import DiningTable from './management/dining-table';
import PrivateRoute from 'app/shared/auth/private-route';
import { AUTHORITIES } from 'app/config/constants';
import { UserMenu } from 'app/shared/layout/menus/main-menu';
import Dashboard from './management/dashboard/dashboard';
import Scrollbars from 'react-custom-scrollbars-2';

export default () => {
  return (
    <div className="flex w-full grow h-max">
      <UserMenu />
      <div className="bg-gray-100 grow">
        <Scrollbars autoHide className="px-4">
          <ErrorBoundaryRoutes>
            <Route
              path="menu-items"
              element={
                <PrivateRoute hasAnyAuthorities={[AUTHORITIES.ADMIN, AUTHORITIES.MENUITEM_VIEW]}>
                  <MenuItem />
                </PrivateRoute>
              }
            />
            <Route
              path="staff"
              element={
                <PrivateRoute hasAnyAuthorities={[AUTHORITIES.ADMIN, AUTHORITIES.STAFF_VIEW]}>
                  <Staff />
                </PrivateRoute>
              }
            />
            <Route
              path="roles"
              element={
                <PrivateRoute hasAnyAuthorities={[AUTHORITIES.ADMIN, AUTHORITIES.STAFFROLE_VIEW]}>
                  <Role />
                </PrivateRoute>
              }
            />
            <Route
              path="tables"
              element={
                <PrivateRoute hasAnyAuthorities={[AUTHORITIES.ADMIN, AUTHORITIES.TABLE_VIEW]}>
                  <DiningTable />
                </PrivateRoute>
              }
            />
            <Route
              path="dashboard"
              element={<PrivateRoute hasAnyAuthorities={[AUTHORITIES.ADMIN, AUTHORITIES.TABLE_VIEW]}>{/*<Dashboard />*/}</PrivateRoute>}
            />

            {/* <Route path="*" element={<PageNotFound />} /> */}
          </ErrorBoundaryRoutes>
        </Scrollbars>
      </div>
    </div>
  );
};
