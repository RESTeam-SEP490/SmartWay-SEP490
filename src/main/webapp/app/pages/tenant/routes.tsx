import React from 'react';
import { Route } from 'react-router-dom';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';

import { AUTHORITIES } from 'app/config/constants';
import PrivateRoute from 'app/shared/auth/private-route';
import PageNotFound from 'app/shared/error/page-not-found';
import DiningTable from './management/dining-table';
import MenuItem from './management/menu-item/menu-item';
import Role from './management/role/role';
import { Staff } from './management/staff/staff';

export default () => {
  return (
    <div className="px-4 bg-slate-50 grow">
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
        {/* <Route path="*" element={<PageNotFound />} /> */}
      </ErrorBoundaryRoutes>
    </div>
  );
};
