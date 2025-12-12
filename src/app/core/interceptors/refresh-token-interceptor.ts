import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, finalize, switchMap, throwError } from 'rxjs';

import { AuthService } from '@/core/services/auth-service';

export const refreshTokenInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  return next(req).pipe(
    catchError((err) => {
      if (
        err instanceof HttpErrorResponse &&
        (err.status !== 401 ||
          err.url?.includes('auth/login') ||
          err.url?.includes('auth/refresh-token'))
      ) {
        return throwError(() => err);
      }

      return authService.refreshToken().pipe(
        switchMap(() => next(req)),
        catchError((err) => {
          if (
            err instanceof HttpErrorResponse &&
            (err.status === 401 || err.status === 422)
          ) {
            authService
              .logout()
              .pipe(finalize(() => router.navigate(['/auth/login'])))
              .subscribe();
          }

          return throwError(() => err);
        }),
      );
    }),
  );
};
