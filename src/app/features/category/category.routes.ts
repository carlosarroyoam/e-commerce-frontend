import { Routes } from '@angular/router';

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
    loadComponent: () =>
      import('@/features/category/pages/category-form/category-form-page').then(
        (m) => m.CategoryFormPage,
      ),
  },
  {
    path: ':id/edit',
    loadComponent: () =>
      import('@/features/category/pages/category-form/category-form-page').then(
        (m) => m.CategoryFormPage,
      ),
  },
  {
    path: ':id',
    loadComponent: () =>
      import('@/features/category/pages/category-form/category-form-page').then(
        (m) => m.CategoryFormPage,
      ),
  },
];
