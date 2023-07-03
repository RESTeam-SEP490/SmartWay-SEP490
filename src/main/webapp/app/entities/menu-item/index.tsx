import React from 'react';
import { Route } from 'react-router-dom';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';

import MenuItem from './menu-item';

const MenuItemRoutes = () => (
  <ErrorBoundaryRoutes>
    <Route index element={<MenuItem />} />
  </ErrorBoundaryRoutes>
);

export default MenuItemRoutes;
