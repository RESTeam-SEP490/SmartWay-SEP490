import { Staff } from 'app/pages/tenant/management/staff/staff';
import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';
import PageNotFound from 'app/shared/error/page-not-found';
import React from 'react';
import { Route } from 'react-router-dom';
import DiningTable from './dining-table';
import MenuItemRoutes from './menu-item';
import Role from './role/role';

export default () => {
  return (
    <div>
      <ErrorBoundaryRoutes>
        <Route path="menu-items" element={<MenuItemRoutes />} />
        <Route path="staffs" element={<Staff />} />
        <Route path="roles" element={<Role />} />
        <Route path="tables" element={<DiningTable />} />
        <Route path="*" element={<PageNotFound />} />
      </ErrorBoundaryRoutes>
    </div>
  );
};
