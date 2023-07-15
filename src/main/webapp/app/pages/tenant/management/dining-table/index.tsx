import React from 'react';
import { Route } from 'react-router-dom';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';

import DiningTable from './dining-table';

const DiningTableRoutes = () => (
  <ErrorBoundaryRoutes>
    <Route index element={<DiningTable />} />
  </ErrorBoundaryRoutes>
);

export default DiningTable;
