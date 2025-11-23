import { Routes } from '@angular/router';

import { AuthLayout } from '@/auth/auth-layout';
import { LoginPage } from '@/auth/pages/login/login-page';

export const routes: Routes = [
  {
    path: '',
    component: AuthLayout,
    children: [
      {
        path: 'login',
        component: LoginPage,
      },
      { path: '', redirectTo: 'login', pathMatch: 'full' },
    ],
  },
];
