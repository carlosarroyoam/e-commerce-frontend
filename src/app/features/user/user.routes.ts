import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('@/features/user/pages/user-list/user-list-page').then((m) => m.UserListPage),
  },
  {
    path: 'new',
    loadComponent: () =>
      import('@/features/user/pages/user-form/user-form-page').then((m) => m.UserFormPage),
  },
  {
    path: ':id/edit',
    loadComponent: () =>
      import('@/features/user/pages/user-form/user-form-page').then((m) => m.UserFormPage),
  },
];
