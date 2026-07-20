import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from '@/app.routes';
import { accessTokenInterceptor } from '@/core/interceptors/access-token-interceptor';
import { httpErrorInterceptor } from '@/core/interceptors/http-error-interceptor';
import { refreshTokenInterceptor } from '@/core/interceptors/refresh-token-interceptor';
import { withCredentialsInterceptor } from '@/core/interceptors/with-credentials-interceptor';
import { xsrfInterceptor } from '@/core/interceptors/xsrf-interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([
        withCredentialsInterceptor,
        xsrfInterceptor,
        accessTokenInterceptor,
        refreshTokenInterceptor,
        httpErrorInterceptor,
      ]),
    ),
  ],
};
