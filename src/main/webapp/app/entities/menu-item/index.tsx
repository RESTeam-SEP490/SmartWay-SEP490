import React from 'react';
import { Route } from 'react-router-dom';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';

import MenuItem from './menu-item';
// import RestaurantDetail from './menu-item-detail';
import RestaurantUpdate from './restaurant-update';
import RestaurantDeleteDialog from './restaurant-delete-dialog';

const RestaurantRoutes = () => (
  <ErrorBoundaryRoutes>
    <Route index element={<MenuItem />} />
    <Route path="new" element={<RestaurantUpdate />} />
    <Route path=":id">
      {/* <Route index element={<RestaurantDetail />} /> */}
      <Route path="edit" element={<RestaurantUpdate />} />
      <Route path="delete" element={<RestaurantDeleteDialog />} />
    </Route>
  </ErrorBoundaryRoutes>
);

export default RestaurantRoutes;
