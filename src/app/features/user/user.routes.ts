import { Routes } from '@angular/router';

import { FORM_MODE_KEY } from '@/core/routing/form-mode';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('@/features/user/pages/user-list/user-list-page').then((m) => m.UserListPage),
  },
  {
    path: 'new',
    data: { [FORM_MODE_KEY]: 'new' },
    loadComponent: () =>
      import('@/features/user/pages/user-form/user-form-page').then((m) => m.UserFormPage),
  },
  {
    path: ':id/edit',
    data: { [FORM_MODE_KEY]: 'edit' },
    loadComponent: () =>
      import('@/features/user/pages/user-form/user-form-page').then((m) => m.UserFormPage),
  },
  {
    path: ':id',
    data: { [FORM_MODE_KEY]: 'view' },
    loadComponent: () =>
      import('@/features/user/pages/user-form/user-form-page').then((m) => m.UserFormPage),
  },
];
