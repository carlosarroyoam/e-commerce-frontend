import { Injectable, Injector } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse,
} from '@angular/common/http';

import { catchError, EMPTY, Observable, switchMap, throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class ResponseInterceptor implements HttpInterceptor {
  constructor(private inject: Injector, private router: Router) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error) => {
        if (error instanceof HttpErrorResponse && error.status === 401 && !error.url?.includes('auth/refresh-token')) {
          return this.handleRefrehToken(request, next);
        } else {
          return throwError(() => error);
        }
      })
    );
  }

  handleRefrehToken(request: HttpRequest<any>, next: HttpHandler) {
    let authservice = this.inject.get(AuthService);

    return authservice.refreshToken().pipe(
      switchMap(() => {
        return next.handle(request);
      }),
      catchError((error) => {
        if (
          error instanceof HttpErrorResponse &&
          (error.status === 401 || error.status === 422)
        ) {
          localStorage.removeItem('user');

          this.router.navigate(['login']);
        }

        return throwError(() => error);
      })
    );
  }
}
