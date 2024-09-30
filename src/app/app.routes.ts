import { Routes } from '@angular/router';

import { authGuard } from '@/app/core/guards/auth.guard';
import { guestGuard } from '@/app/core/guards/guest.guard';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('@/app/auth/auth.routes').then((m) => m.routes),
    canActivate: [guestGuard],
  },
  {
    path: 'dashboard',
    loadChildren: () =>
      import('@/app/dashboard/dashboard.routes').then((m) => m.routes),
    canActivate: [authGuard],
  },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
];
