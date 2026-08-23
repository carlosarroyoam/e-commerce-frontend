import { DOCUMENT } from '@angular/common';
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';

import { isApiRequest } from '@/core/utils/http.utils';

const XSRF_COOKIE_NAME = 'XSRF-TOKEN';
const XSRF_HEADER_NAME = 'X-XSRF-TOKEN';
const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);

/**
 * Adjunta el token XSRF de la cookie al header correspondiente en peticiones no seguras a la API.
 *
 * @param request Petición HTTP saliente.
 * @param next Siguiente handler de la cadena de interceptors.
 * @returns Observable con el evento HTTP resultante.
 */
export const xsrfInterceptor: HttpInterceptorFn = (request, next) => {
  const document = inject(DOCUMENT);

  if (
    SAFE_METHODS.has(request.method) ||
    request.headers.has(XSRF_HEADER_NAME) ||
    !isApiRequest(request.url)
  ) {
    return next(request);
  }

  const xsrfToken = getCookieValue(document.cookie, XSRF_COOKIE_NAME);

  return next(
    xsrfToken ? request.clone({ setHeaders: { [XSRF_HEADER_NAME]: xsrfToken } }) : request,
  );
};

/**
 * Extrae el valor de una cookie por nombre a partir del string de cookies del documento.
 *
 * @param cookies String completo de cookies del documento.
 * @param name Nombre de la cookie a buscar.
 * @returns El valor decodificado de la cookie, o null si no existe.
 */
const getCookieValue = (cookies: string, name: string): string | null => {
  const prefix = `${encodeURIComponent(name)}=`;
  const cookie = cookies
    .split(';')
    .map((value) => value.trim())
    .find((value) => value.startsWith(prefix));

  return cookie ? decodeURIComponent(cookie.slice(prefix.length)) : null;
};
