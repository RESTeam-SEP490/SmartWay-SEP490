import React from 'react';
import { Route } from 'react-router-dom';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';

import Restaurant from './restaurant';
import MenuItemRoutes from './menu-item';
import { Staff } from 'app/pages/user/management/staff/staff';

export default () => {
  return (
    <div>
      <ErrorBoundaryRoutes>
        {/* prettier-ignore */}
        <Route path="restaurant/*" element={<Restaurant />} />
        <Route path="menu-items/*" element={<MenuItemRoutes />} />
        <Route path="staff" element={<Staff />} />
      </ErrorBoundaryRoutes>
    </div>
  );
};
