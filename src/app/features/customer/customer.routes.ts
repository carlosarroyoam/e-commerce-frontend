import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('@/shared/components/layout/main-layout/main-layout').then((m) => m.MainLayout),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('@/features/customer/pages/customer-list/customer-list-page').then(
            (m) => m.CustomerListPage,
          ),
      },
    ],
  },
];
