import { Routes } from '@angular/router';

import { MainLayout } from '@/features/main/main-layout';
import { UsersPage } from '@/features/main/pages/users/users-page';

export const routes: Routes = [
  {
    path: '',
    component: MainLayout,
    children: [
      { path: 'users', component: UsersPage },
      { path: '', redirectTo: 'users', pathMatch: 'full' },
    ],
  },
];
