import React from 'react';
import { Route } from 'react-router-dom';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';

import MenuItem from './management/menu-item/menu-item';
import { Staff } from './management/staff/staff';
import Role from './management/role/role';
import DiningTable from './management/dining-table';
import PageNotFound from 'app/shared/error/page-not-found';

export default () => {
  return (
    <div className="px-4 bg-gray-50 grow">
      <ErrorBoundaryRoutes>
        {/* prettier-ignore */}
        <Route path="menu-items/*" element={<MenuItem />} />
        <Route path="staffs/*" element={<Staff />} />
        <Route path="roles" element={<Role />} />
        <Route path="table" element={<DiningTable />} />
        <Route path="*" element={<PageNotFound />} />
      </ErrorBoundaryRoutes>
    </div>
  );
};
