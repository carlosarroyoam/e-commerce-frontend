import { Routes } from '@angular/router';

import { DashboardLayout } from '@/features/dashboard/dashboard-layout';
import { UsersPageComponent } from '@/features/dashboard/pages/users/users-page';

export const routes: Routes = [
  {
    path: '',
    component: DashboardLayout,
    children: [
      { path: 'users', component: UsersPageComponent },
      { path: '', redirectTo: 'users', pathMatch: 'full' },
    ],
  },
];
