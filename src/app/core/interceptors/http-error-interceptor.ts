import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';

import { AUTH_ROUTES } from '@/core/constants/auth.constants';
import { DialogService } from '@/core/services/dialog-service';

export const httpErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const dialogService = inject(DialogService);
  const isAuthRequest = AUTH_ROUTES.some((route) => req.url.includes(route));

  return next(req).pipe(
    catchError((err) => {
      // If error is not instance of HttpErrorResponse throw
      if (!(err instanceof HttpErrorResponse)) {
        return throwError(() => err);
      }

      // If error status equals to 401 and route not in AUTH_ROUTES throw to send it to refreshTokenInterceptor
      if (err.status === 401 && !isAuthRequest) {
        return throwError(() => err);
      }

      if (err.error?.status && err.error.status !== 500) {
        dialogService.open({
          data: {
            title: err.error.error,
            description: err.error.message,
            primaryButtonLabel: 'Dismiss',
          },
        });
      } else {
        dialogService.open({
          data: {
            title: 'Whoops! something went wrong',
            description:
              'There was a problem processing the request. Please try again later.',
            primaryButtonLabel: 'Dismiss',
          },
        });
      }

      return throwError(() => err);
    }),
  );
};
