import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, switchMap, throwError } from 'rxjs';

import { API_AUTH_ROUTES } from '@/core/constants/auth.constants';
import { AuthStore } from '@/core/data-access/stores/auth-store/auth.store';

export const refreshTokenInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
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

      return authStore.refreshAccessToken().pipe(
        switchMap(() =>
          next(
            req.clone({
              setHeaders: {
                Authorization: `Bearer ${authStore.accessToken()}`,
              },
            }),
          ),
        ),
        catchError((refreshError) => {
          if (
            refreshError instanceof HttpErrorResponse &&
            (refreshError.status === 401 || refreshError.status === 422)
          ) {
            authStore.logout();
            router.navigate(['/auth/login']);
          }

          return throwError(() => refreshError);
        }),
      );
    }),
  );
};
