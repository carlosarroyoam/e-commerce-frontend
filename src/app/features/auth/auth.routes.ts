import { Routes } from '@angular/router';

import { LoginPage } from '@/features/auth/pages/login/login-page';
import { AuthLayout } from '@/shared/components/layout/auth-layout/auth-layout';

export const routes: Routes = [
  {
    path: '',
    component: AuthLayout,
    children: [{ path: 'login', component: LoginPage }],
  },
];
