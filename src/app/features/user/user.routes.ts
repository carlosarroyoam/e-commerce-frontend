import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('@/features/user/pages/user-list/user-list-page').then((m) => m.UserListPage),
  },
];
