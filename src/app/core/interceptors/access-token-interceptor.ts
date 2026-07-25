import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';

import { SKIP_ACCESS_TOKEN } from '@/core/http/auth-request-context';
import { AuthStore } from '@/core/data-access/stores/auth-store/auth.store';

export const accessTokenInterceptor: HttpInterceptorFn = (request, next) => {
  const authStore = inject(AuthStore);
  const accessToken = authStore.accessToken();

  if (request.context.get(SKIP_ACCESS_TOKEN) || !accessToken) {
    return next(request);
  }

  return next(
    request.clone({
      setHeaders: { Authorization: `Bearer ${accessToken}` },
    }),
  );
};
