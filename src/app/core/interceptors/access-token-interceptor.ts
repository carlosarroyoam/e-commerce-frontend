import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';

import { API_AUTH_ROUTES } from '@/core/constants/auth.constants';
import { AuthStore } from '@/core/data-access/stores/auth-store/auth.store';

export const accessTokenInterceptor: HttpInterceptorFn = (req, next) => {
  const authStore = inject(AuthStore);
  const isAuthRequest = API_AUTH_ROUTES.some((route) =>
    req.url.includes(route),
  );
  const token = authStore.accessToken();

  if (isAuthRequest || !token) {
    return next(req);
  }

  return next(
    req.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    }),
  );
};
