import React from 'react';
import { Route } from 'react-router-dom';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';

import PageNotFound from 'app/shared/error/page-not-found';
import OrderScreen from './order';

export default () => {
  return (
    <div className=" bg-gray-100 grow">
      <ErrorBoundaryRoutes>
        <Route path="orders" element={<OrderScreen />} />
        {/* <Route path="*" element={<PageNotFound />} /> */}
      </ErrorBoundaryRoutes>
    </div>
  );
};
