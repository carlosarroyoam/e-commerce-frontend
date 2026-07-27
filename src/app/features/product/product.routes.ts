import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('@/features/product/pages/product-list/product-list').then((m) => m.ProductListPage),
  },
];
