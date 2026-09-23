import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('@/features/customer/pages/customer-list/customer-list-page').then(
        (m) => m.CustomerListPage,
      ),
  },
  {
    path: 'new',
    loadComponent: () =>
      import('@/features/customer/pages/customer-form/customer-form-page').then(
        (m) => m.CustomerFormPage,
      ),
  },
  {
    path: ':id/edit',
    loadComponent: () =>
      import('@/features/customer/pages/customer-form/customer-form-page').then(
        (m) => m.CustomerFormPage,
      ),
  },
  {
    path: ':id',
    loadComponent: () =>
      import('@/features/customer/pages/customer-detail/customer-detail-page').then(
        (m) => m.CustomerDetailPage,
      ),
  },
];
