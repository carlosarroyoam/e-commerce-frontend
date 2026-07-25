import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';

import {
  RETRY_ON_UNAUTHORIZED,
  SKIP_ERROR_DIALOG,
} from '@/core/http/auth-request-context';
import { AlertDialogService } from '@/shared/services/alert-dialog-service/alert-dialog-service';

export const httpErrorInterceptor: HttpInterceptorFn = (request, next) => {
  const alertDialogService = inject(AlertDialogService);

  return next(request).pipe(
    catchError((error: unknown) => {
      if (
        !(error instanceof HttpErrorResponse) ||
        (error.status === 401 && request.context.get(RETRY_ON_UNAUTHORIZED)) ||
        request.context.get(SKIP_ERROR_DIALOG)
      ) {
        return throwError(() => error);
      }

      const hasApiError = error.error?.status && error.error.status !== 500;

      alertDialogService.open({
        data: hasApiError
          ? {
              title: error.error.error,
              description: error.error.message,
              primaryButtonLabel: 'Dismiss',
            }
          : {
              title: 'Whoops! something went wrong',
              description:
                'There was a problem processing the request. Please try again later.',
              primaryButtonLabel: 'Dismiss',
            },
      });

      return throwError(() => error);
    }),
  );
};
