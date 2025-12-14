import { Routes } from '@angular/router';

import { authGuard } from '@/core/guards/auth-guard';
import { guestGuard } from '@/core/guards/guest-guard';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () =>
      import('@/features/auth/auth.routes').then((m) => m.routes),
    canActivate: [guestGuard],
  },
  {
    path: '',
    loadChildren: () =>
      import('@/features/main/main.routes').then((m) => m.routes),
    canActivate: [authGuard],
  },
];
