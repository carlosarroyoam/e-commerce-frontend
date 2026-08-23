import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, switchMap, throwError } from 'rxjs';

import { AuthStore } from '@/core/data-access/stores/auth-store/auth.store';
import { RETRY_ON_UNAUTHORIZED } from '@/core/http/auth-request-context';

/**
 * Ante una respuesta 401 en peticiones marcadas para reintento, refresca el token y reintenta la petición; si el refresh falla, cierra la sesión y redirige a login.
 *
 * @param request Petición HTTP saliente.
 * @param next Siguiente handler de la cadena de interceptors.
 * @returns Observable con el evento HTTP resultante o el error propagado.
 */
export const refreshTokenInterceptor: HttpInterceptorFn = (request, next) => {
  const router = inject(Router);
  const authStore = inject(AuthStore);

  return next(request).pipe(
    catchError((error: unknown) => {
      if (
        !(error instanceof HttpErrorResponse) ||
        error.status !== 401 ||
        !request.context.get(RETRY_ON_UNAUTHORIZED)
      ) {
        return throwError(() => error);
      }

      return authStore.refreshAccessToken().pipe(
        switchMap(() =>
          next(
            request.clone({
              setHeaders: { Authorization: `Bearer ${authStore.accessToken()}` },
            }),
          ),
        ),
        catchError((refreshError: unknown) => {
          if (
            refreshError instanceof HttpErrorResponse &&
            (refreshError.status === 401 || refreshError.status === 422)
          ) {
            authStore.logout();
            void router.navigate(['/auth/login']);
          }

          return throwError(() => refreshError);
        }),
      );
    }),
  );
};
