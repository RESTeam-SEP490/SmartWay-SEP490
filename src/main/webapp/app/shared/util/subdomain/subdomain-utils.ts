import { AdminAppRoutes, MainAppRoutes } from 'app/routes';

export const APPS = [
  {
    subdomain: 'www',
    app: MainAppRoutes,
    main: true,
  },
  {
    subdomain: 'admin',
    app: AdminAppRoutes,
    main: false,
  },
];
