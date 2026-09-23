import { Routes } from '@angular/router';

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
    loadComponent: () =>
      import('@/features/product/pages/product-form/product-form-page').then(
        (m) => m.ProductFormPage,
      ),
  },
  {
    path: ':id/edit',
    loadComponent: () =>
      import('@/features/product/pages/product-form/product-form-page').then(
        (m) => m.ProductFormPage,
      ),
  },
  {
    path: ':id',
    loadComponent: () =>
      import('@/features/product/pages/product-detail/product-detail-page').then(
        (m) => m.ProductDetailPage,
      ),
  },
];
