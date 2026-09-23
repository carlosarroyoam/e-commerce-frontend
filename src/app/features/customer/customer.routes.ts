import { Routes } from '@angular/router';

import { FORM_MODE_KEY } from '@/core/routing/form-mode';

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
    data: { [FORM_MODE_KEY]: 'new' },
    loadComponent: () =>
      import('@/features/customer/pages/customer-form/customer-form-page').then(
        (m) => m.CustomerFormPage,
      ),
  },
  {
    path: ':id/edit',
    data: { [FORM_MODE_KEY]: 'edit' },
    loadComponent: () =>
      import('@/features/customer/pages/customer-form/customer-form-page').then(
        (m) => m.CustomerFormPage,
      ),
  },
  {
    path: ':id',
    data: { [FORM_MODE_KEY]: 'view' },
    loadComponent: () =>
      import('@/features/customer/pages/customer-form/customer-form-page').then(
        (m) => m.CustomerFormPage,
      ),
  },
];
