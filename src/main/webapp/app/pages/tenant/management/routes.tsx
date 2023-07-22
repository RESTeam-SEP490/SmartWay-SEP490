import React from 'react';
import { Route } from 'react-router-dom';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';

import Restaurant from './restaurant';
import MenuItemRoutes from './menu-item';
import { Staff } from 'app/pages/tenant/management/staff/staff';
import { ZoneCheckBoxes } from './zone/zone';
import DiningTable from './dining-table';
import Role from './role/role';
import Stripe from 'app/pages/tenant/stripe/Stripe';

export default () => {
  return (
    <div>
      <ErrorBoundaryRoutes>
        {/* prettier-ignore */}
        <Route path="restaurant/*" element={<Restaurant />} />
        <Route path="menu-items/*" element={<MenuItemRoutes />} />
        <Route path="staffs/*" element={<Staff />} />
        <Route path="roles" element={<Role />} />
        <Route path="table" element={<DiningTable />} />
        <Route path="stripe" element={<Stripe />} />
      </ErrorBoundaryRoutes>
    </div>
  );
};
