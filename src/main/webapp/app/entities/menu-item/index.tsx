import React from 'react';
import { Route } from 'react-router-dom';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';

import MenuItem from './menu-item';
// import RestaurantDetail from './menu-item-detail';
import RestaurantUpdate, { MenuItemUpdate } from './menu-item-form';
import RestaurantDeleteDialog from './restaurant-delete-dialog';
import Home from 'app/modules/home/home';

const MenuItemRoutes = () => (
  <ErrorBoundaryRoutes>
    <Route index element={<MenuItem />} />

    <Route path=":id">
      <Route path="delete" element={<RestaurantDeleteDialog />} />
    </Route>
  </ErrorBoundaryRoutes>
);

export default MenuItemRoutes;
