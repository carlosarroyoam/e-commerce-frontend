import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from '@/app/app.routes';
import {
  responseErrorInterceptor,
  withCredentialsInterceptor,
} from '@/app/core/interceptors/http.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([withCredentialsInterceptor, responseErrorInterceptor]),
    ),
  ],
};
