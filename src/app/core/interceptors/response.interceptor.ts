import { Injectable, Injector } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse,
} from '@angular/common/http';

import { catchError, Observable, switchMap, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class ResponseInterceptor implements HttpInterceptor {
  constructor(private readonly inject: Injector) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error) => {
        if (
          error instanceof HttpErrorResponse &&
          error.status === 401 &&
          !error.url?.includes('auth/refresh-token')
        ) {
          return this.handleRefrehToken(request, next);
        } else {
          return throwError(() => error);
        }
      })
    );
  }

  handleRefrehToken(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const authservice = this.inject.get(AuthService);

    return authservice.refreshToken().pipe(
      switchMap(() => next.handle(request)),
      catchError((error) => {
        if (
          error instanceof HttpErrorResponse &&
          (error.status === 401 || error.status === 422)
        ) {
          authservice.logout();
        }

        return throwError(() => error);
      })
    );
  }
}
