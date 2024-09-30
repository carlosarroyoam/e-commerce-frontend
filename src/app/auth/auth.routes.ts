import { Routes } from '@angular/router';

import { LoginPageComponent } from '@/app/auth/pages/login/login-page.component';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginPageComponent,
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
];
