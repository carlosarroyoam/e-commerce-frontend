import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandlerFn,
  HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, Observable, switchMap, throwError } from 'rxjs';

import { AuthService } from '@/core/services/auth.service';

export function withCredentialsInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> {
  const reqWithCreds = req.clone({
    withCredentials: true,
  });

  return next(reqWithCreds);
}

export function responseErrorInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> {
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
            authService.logout();
          }

          return throwError(() => err);
        }),
      );
    }),
  );
}
