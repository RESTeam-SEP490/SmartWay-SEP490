import { DOMAIN_DEV, DOMAIN_PROD } from 'app/app.constant';

export const getAppType = (host: string, isInProduction: boolean) => {
  const domain = isInProduction ? DOMAIN_PROD : DOMAIN_DEV;
  const hostParts = host.replace(domain, '').split('.');
  if (hostParts.length !== 2) return { appType: null, subdomain: null };
  else if (hostParts[0] === 'admin') return { appType: 'admin', subdomain: 'admin' };
  else if (hostParts[0] === 'www') return { appType: 'main', subdomain: 'www' };
  else return { appType: 'tenant', subdomain: hostParts[0] };
};
