import { HttpInterceptorFn } from '@angular/common/http';

import { isApiRequest } from '@/core/utils/http.utils';

/**
 * Habilita el envío de credenciales (cookies) en las peticiones dirigidas a la API.
 *
 * @param request Petición HTTP saliente.
 * @param next Siguiente handler de la cadena de interceptors.
 * @returns Observable con el evento HTTP resultante.
 */
export const withCredentialsInterceptor: HttpInterceptorFn = (request, next) => {
  if (!isApiRequest(request.url)) {
    return next(request);
  }

  return next(
    request.clone({
      withCredentials: true,
    }),
  );
};
