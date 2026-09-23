import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('@/features/auth/pages/login/login-page').then((m) => m.LoginPage),
  },
];
