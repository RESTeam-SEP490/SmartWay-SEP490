import React from 'react';
import { Route } from 'react-router-dom';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';

import Restaurant from './restaurant';
import MenuItemRoutes from './menu-item';
import { ZoneCheckBoxes } from './zone/zone';
import DiningTable from './dining-table';

export default () => {
  return (
    <div>
      <ErrorBoundaryRoutes>
        {/* prettier-ignore */}
        <Route path="restaurant/*" element={<Restaurant />} />
        <Route path="menu-items/*" element={<MenuItemRoutes />} />
        <Route path="table" element={<DiningTable />} />
      </ErrorBoundaryRoutes>
    </div>
  );
};