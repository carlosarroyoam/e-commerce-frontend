import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('@/shared/components/layout/auth-layout/auth-layout').then(
        (m) => m.AuthLayout,
      ),
    children: [
      {
        path: 'login',
        loadComponent: () =>
          import('@/features/auth/pages/login/login-page').then(
            (m) => m.LoginPage,
          ),
      },
    ],
  },
];
