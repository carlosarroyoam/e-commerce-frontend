import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('@/features/order/pages/order-list/order-list-page').then((m) => m.OrderListPage),
  },
];
