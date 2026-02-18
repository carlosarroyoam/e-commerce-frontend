import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';

import { API_AUTH_ROUTES } from '@/core/constants/auth.constants';
import { AuthService } from '@/core/data-access/services/auth-service/auth-service';
import { AuthStore } from '@/core/data-access/store/auth.store';

export const refreshTokenInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const authStore = inject(AuthStore);

  const isAuthRequest = API_AUTH_ROUTES.some((route) =>
    req.url.includes(route),
  );

  return next(req).pipe(
    catchError((err) => {
      // If error status not equals to 401 and route in AUTH_ROUTES throw to send it to httpErrorInterceptor
      if (
        !(err instanceof HttpErrorResponse) ||
        err.status !== 401 ||
        isAuthRequest
      ) {
        return throwError(() => err);
      }

      return authService.refreshToken().pipe(
        switchMap(() => next(req)),
        catchError((refreshError) => {
          if (
            refreshError instanceof HttpErrorResponse &&
            (refreshError.status === 401 || refreshError.status === 422)
          ) {
            authStore.logout();
          }

          return throwError(() => refreshError);
        }),
      );
    }),
  );
};
