/// <reference types="@angular/localize" />

import { enableProdMode } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';

import { App } from '@/app';
import { appConfig } from '@/app.config';
import { environment } from '@/environments/environment';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(App, appConfig)
  .finally(() => document.getElementById('bootstrap-loader')?.remove())
  .catch((error: unknown) => console.error(error));
