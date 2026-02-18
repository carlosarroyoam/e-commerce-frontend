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
    path: 'dashboard',
    loadChildren: () =>
      import('@/features/dashboard/dashboard.routes').then((m) => m.routes),
    canActivate: [authGuard],
  },
  {
    path: 'orders',
    loadChildren: () =>
      import('@/features/order/order.routes').then((m) => m.routes),
    canActivate: [authGuard],
  },
  {
    path: 'products',
    loadChildren: () =>
      import('@/features/product/product.routes').then((m) => m.routes),
    canActivate: [authGuard],
  },
  {
    path: 'categories',
    loadChildren: () =>
      import('@/features/category/category.routes').then((m) => m.routes),
    canActivate: [authGuard],
  },
  {
    path: 'users',
    loadChildren: () =>
      import('@/features/user/user.routes').then((m) => m.routes),
    canActivate: [authGuard],
  },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
];
