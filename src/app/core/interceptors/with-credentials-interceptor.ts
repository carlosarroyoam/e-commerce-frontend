import { HttpInterceptorFn } from '@angular/common/http';

export const withCredentialsInterceptor: HttpInterceptorFn = (request, next) => {
  const requestWithCredentials = request.clone({
    withCredentials: true,
  });

  return next(requestWithCredentials);
};
