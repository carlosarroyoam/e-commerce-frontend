import { Routes } from '@angular/router';

import { LoginPageComponent } from './pages/login/login-page.component';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginPageComponent,
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
];
