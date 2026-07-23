/// <reference types="@angular/localize" />

import { enableProdMode, provideZoneChangeDetection } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';

import { App } from '@/app';
import { appConfig } from '@/app.config';
import { environment } from '@/environments/environment';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(App, {
  ...appConfig,
  providers: [provideZoneChangeDetection(), ...appConfig.providers],
})
  .finally(() => document.getElementById('bootstrap-loader')?.remove())
  .catch((err: unknown) => console.error(err));
