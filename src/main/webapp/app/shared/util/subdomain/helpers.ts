import { DOMAIN_DEV, DOMAIN_PROD } from 'app/app.constant';
import { useAppSelector } from 'app/config/store';

export const getAppTypeAndSubdomain = (host: string, isInProduction: boolean) => {
  const domain = isInProduction ? DOMAIN_PROD : DOMAIN_DEV;
  const hostParts = host.replace(domain, '').split('.');
  if (hostParts.length !== 2) return { appType: null, subdomain: null };
  else if (hostParts[0] === 'admin') return { appType: 'admin', subdomain: 'admin' };
  else if (hostParts[0] === 'www') return { appType: 'main', subdomain: 'www' };
  else return { appType: 'tenant', subdomain: hostParts[0] };
};

export const getAppUrl = (isInProd: boolean, subdomain: string, domain: string, path: string) => {
  return `http${isInProd ? 's' : ''}://${subdomain}.${domain + path}`;
};
