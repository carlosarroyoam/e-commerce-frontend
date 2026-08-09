import { HttpInterceptorFn } from '@angular/common/http';

import { isApiRequest } from '@/core/utils/http.utils';

export const withCredentialsInterceptor: HttpInterceptorFn = (request, next) => {
  if (!isApiRequest(request.url)) {
    return next(request);
  }

  return next(
    request.clone({
      withCredentials: true,
    }),
  );
};
