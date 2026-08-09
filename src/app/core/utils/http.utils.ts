import { environment } from '@/environments/environment';

export const isApiRequest = (url: string): boolean => {
  const browserOrigin = window.location.origin;
  const apiOrigin = new URL(environment.apiUrl, browserOrigin).origin;
  const requestOrigin = new URL(url, browserOrigin).origin;

  return requestOrigin === apiOrigin;
};
