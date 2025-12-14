import { Routes } from '@angular/router';

import { AuthLayout } from '@/features/auth/auth-layout';
import { LoginPage } from '@/features/auth/pages/login/login-page';

export const routes: Routes = [
  {
    path: '',
    component: AuthLayout,
    children: [
      { path: 'login', component: LoginPage },
      { path: '', redirectTo: 'login', pathMatch: 'full' },
    ],
  },
];
