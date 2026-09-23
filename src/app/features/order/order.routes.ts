import { Routes } from '@angular/router';

import { FORM_MODE_KEY } from '@/core/routing/form-mode';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('@/features/order/pages/order-list/order-list-page').then((m) => m.OrderListPage),
  },
  {
    path: 'new',
    data: { [FORM_MODE_KEY]: 'new' },
    loadComponent: () =>
      import('@/features/order/pages/order-form/order-form-page').then((m) => m.OrderFormPage),
  },
  {
    path: ':id/edit',
    data: { [FORM_MODE_KEY]: 'edit' },
    loadComponent: () =>
      import('@/features/order/pages/order-form/order-form-page').then((m) => m.OrderFormPage),
  },
  {
    path: ':id',
    data: { [FORM_MODE_KEY]: 'view' },
    loadComponent: () =>
      import('@/features/order/pages/order-form/order-form-page').then((m) => m.OrderFormPage),
  },
];
