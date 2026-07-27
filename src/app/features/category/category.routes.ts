import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('@/features/category/pages/category-list/category-list').then(
        (m) => m.CategoryListPage,
      ),
  },
];
