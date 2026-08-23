import { environment } from '@/environments/environment';

/**
 * Determina si una URL de petición apunta al mismo origen que la API configurada.
 *
 * @param url URL de la petición a evaluar.
 * @returns `true` si la URL pertenece al origen de la API.
 */
export const isApiRequest = (url: string): boolean => {
  const browserOrigin = window.location.origin;
  const apiOrigin = new URL(environment.apiUrl, browserOrigin).origin;
  const requestOrigin = new URL(url, browserOrigin).origin;

  return requestOrigin === apiOrigin;
};
