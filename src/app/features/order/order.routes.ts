import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('@/features/order/pages/order-list/order-list-page').then((m) => m.OrderListPage),
  },
  {
    path: 'new',
    loadComponent: () =>
      import('@/features/order/pages/order-form/order-form-page').then((m) => m.OrderFormPage),
  },
  {
    path: ':id/edit',
    loadComponent: () =>
      import('@/features/order/pages/order-form/order-form-page').then((m) => m.OrderFormPage),
  },
  {
    path: ':id',
    loadComponent: () =>
      import('@/features/order/pages/order-form/order-form-page').then((m) => m.OrderFormPage),
  },
];
