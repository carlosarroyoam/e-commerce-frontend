import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, switchMap, throwError } from 'rxjs';

import { RETRY_ON_UNAUTHORIZED } from '@/core/http/auth-request-context';
import { AuthStore } from '@/core/data-access/stores/auth-store/auth.store';

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
              setHeaders: {
                Authorization: `Bearer ${authStore.accessToken()}`,
              },
            }),
          ),
        ),
        catchError((refreshError: unknown) => {
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
