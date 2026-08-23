import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';

import { RETRY_ON_UNAUTHORIZED, SKIP_ERROR_DIALOG } from '@/core/http/auth-request-context';
import { AlertDialogService } from '@/shared/services/alert-dialog-service/alert-dialog-service';

const DEFAULT_ERROR_DIALOG = {
  title: 'Whoops! something went wrong',
  description: 'There was a problem processing the request. Please try again later.',
  primaryButtonLabel: 'Dismiss',
};

/**
 * Muestra un diálogo de error para las peticiones fallidas que no manejan su propio error.
 *
 * @param request Petición HTTP saliente.
 * @param next Siguiente handler de la cadena de interceptors.
 * @returns Observable con el evento HTTP resultante o el error propagado.
 */
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

      alertDialogService.open({ data: getErrorDialogData(error) });
      return throwError(() => error);
    }),
  );
};

/**
 * Construye el título y la descripción del diálogo a partir del error HTTP recibido.
 *
 * @param error Error HTTP recibido.
 * @returns Datos del diálogo de error a mostrar.
 */
const getErrorDialogData = (error: HttpErrorResponse) => {
  const apiError = error.error;

  if (apiError?.status && apiError.status !== 500) {
    return {
      title: apiError.error,
      description: apiError.message,
      primaryButtonLabel: 'Dismiss',
    };
  }

  return DEFAULT_ERROR_DIALOG;
};
