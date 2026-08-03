import { HttpInterceptorFn } from '@angular/common/http';

export const withCredentialsInterceptor: HttpInterceptorFn = (request, next) => {
  return next(
    request.clone({
      withCredentials: true,
    }),
  );
};
