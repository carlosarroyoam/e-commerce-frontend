import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, finalize, switchMap, throwError } from 'rxjs';

import { API_AUTH_ROUTES } from '@/core/constants/auth.constants';
import { AuthService } from '@/features/auth/data-access/services/auth-service/auth-service';

export const refreshTokenInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const authService = inject(AuthService);
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
            authService
              .logout()
              .pipe(finalize(() => router.navigate(['/auth/login'])))
              .subscribe();
          }

          return throwError(() => refreshError);
        }),
      );
    }),
  );
};
