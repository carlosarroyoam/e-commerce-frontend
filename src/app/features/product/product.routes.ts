import { Routes } from '@angular/router';

import { FORM_MODE_KEY } from '@/core/routing/form-mode';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('@/features/product/pages/product-list/product-list-page').then(
        (m) => m.ProductListPage,
      ),
  },
  {
    path: 'new',
    data: { [FORM_MODE_KEY]: 'new' },
    loadComponent: () =>
      import('@/features/product/pages/product-form/product-form-page').then(
        (m) => m.ProductFormPage,
      ),
  },
  {
    path: ':id/edit',
    data: { [FORM_MODE_KEY]: 'edit' },
    loadComponent: () =>
      import('@/features/product/pages/product-form/product-form-page').then(
        (m) => m.ProductFormPage,
      ),
  },
  {
    path: ':id',
    data: { [FORM_MODE_KEY]: 'view' },
    loadComponent: () =>
      import('@/features/product/pages/product-form/product-form-page').then(
        (m) => m.ProductFormPage,
      ),
  },
];
