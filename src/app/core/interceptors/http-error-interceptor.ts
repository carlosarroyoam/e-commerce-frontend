import { DialogService } from '@/core/services/dialog-service';
import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';

export const httpErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const dialogService = inject(DialogService);

  return next(req).pipe(
    catchError((err) => {
      console.error(err.message);

      if (err instanceof HttpErrorResponse) {
        dialogService.open({
          data: {
            title: err.error.error,
            description: err.error.message,
            primaryButtonLabel: 'Dismiss',
          },
        });
      }

      return throwError(() => err);
    }),
  );
};
