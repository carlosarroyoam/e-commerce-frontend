import { provideHttpClient, withInterceptors } from '@angular/common/http';
import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from '@/app.routes';
import { AuthStore } from '@/core/data-access/stores/auth-store/auth.store';
import { accessTokenInterceptor } from '@/core/interceptors/access-token-interceptor';
import { httpErrorInterceptor } from '@/core/interceptors/http-error-interceptor';
import { refreshTokenInterceptor } from '@/core/interceptors/refresh-token-interceptor';
import { withCredentialsInterceptor } from '@/core/interceptors/with-credentials-interceptor';
import { xsrfInterceptor } from '@/core/interceptors/xsrf-interceptor';
import { provideLucideConfig } from '@lucide/angular';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideAppInitializer(() => inject(AuthStore).restoreSession()),
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
    provideLucideConfig({
      strokeWidth: 1.5,
    }),
  ],
};
