import { DOCUMENT } from '@angular/common';
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';

import { environment } from '@/environments/environment';

const XSRF_COOKIE_NAME = 'XSRF-TOKEN';
const XSRF_HEADER_NAME = 'X-XSRF-TOKEN';
const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);

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
    xsrfToken
      ? request.clone({ setHeaders: { [XSRF_HEADER_NAME]: xsrfToken } })
      : request,
  );
};

const isApiRequest = (url: string): boolean => {
  const browserOrigin = window.location.origin;
  const apiOrigin = new URL(environment.apiUrl, browserOrigin).origin;
  const requestOrigin = new URL(url, browserOrigin).origin;

  return requestOrigin === apiOrigin;
};

const getCookieValue = (cookies: string, name: string): string | null => {
  const prefix = `${encodeURIComponent(name)}=`;
  const cookie = cookies
    .split(';')
    .map((value) => value.trim())
    .find((value) => value.startsWith(prefix));

  return cookie ? decodeURIComponent(cookie.slice(prefix.length)) : null;
};
