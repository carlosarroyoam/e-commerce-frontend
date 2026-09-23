import { Routes } from '@angular/router';

import { FORM_MODE_KEY } from '@/core/routing/form-mode';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('@/features/category/pages/category-list/category-list-page').then(
        (m) => m.CategoryListPage,
      ),
  },
  {
    path: 'new',
    data: { [FORM_MODE_KEY]: 'new' },
    loadComponent: () =>
      import('@/features/category/pages/category-form/category-form-page').then(
        (m) => m.CategoryFormPage,
      ),
  },
  {
    path: ':id/edit',
    data: { [FORM_MODE_KEY]: 'edit' },
    loadComponent: () =>
      import('@/features/category/pages/category-form/category-form-page').then(
        (m) => m.CategoryFormPage,
      ),
  },
  {
    path: ':id',
    data: { [FORM_MODE_KEY]: 'view' },
    loadComponent: () =>
      import('@/features/category/pages/category-form/category-form-page').then(
        (m) => m.CategoryFormPage,
      ),
  },
];
