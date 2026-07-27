import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('@/features/customer/pages/customer-list/customer-list-page').then(
        (m) => m.CustomerListPage,
      ),
  },
];
