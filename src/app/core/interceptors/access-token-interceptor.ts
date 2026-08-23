import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';

import { AuthStore } from '@/core/data-access/stores/auth-store/auth.store';
import { SKIP_ACCESS_TOKEN } from '@/core/http/auth-request-context';

/**
 * Adjunta el access token vigente al header Authorization de cada petición saliente.
 *
 * @param request Petición HTTP saliente.
 * @param next Siguiente handler de la cadena de interceptors.
 * @returns Observable con el evento HTTP resultante.
 */
export const accessTokenInterceptor: HttpInterceptorFn = (request, next) => {
  const authStore = inject(AuthStore);
  const accessToken = authStore.accessToken();

  if (request.context.get(SKIP_ACCESS_TOKEN) || !accessToken) {
    return next(request);
  }

  return next(
    request.clone({
      setHeaders: { Authorization: `Bearer ${accessToken}` },
    }),
  );
};
