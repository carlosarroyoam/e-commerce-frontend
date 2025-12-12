import { HttpInterceptorFn } from '@angular/common/http';

export const withCredentialsInterceptor: HttpInterceptorFn = (req, next) => {
  const reqWithCreds = req.clone({
    withCredentials: true,
  });

  return next(reqWithCreds);
};
