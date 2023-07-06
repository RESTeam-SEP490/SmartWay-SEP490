import { AdminAppRoutes, MainAppRoutes } from 'app/routes';

export const getApp = () => {
  const host = window.location.host;
  const subdomain = getSubDomain(host);
  if (subdomain === 'admin') return AdminAppRoutes;
  else return MainAppRoutes;
};

const getSubDomain = (host: string) => {
  const hostParts = host.split('.');

  if (hostParts.length === 2 && hostParts[0] === 'admin') return 'admin';
  else return '';
};
