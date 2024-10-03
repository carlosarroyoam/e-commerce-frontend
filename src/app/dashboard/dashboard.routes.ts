import { Routes } from '@angular/router';

import { DashboardLayoutComponent } from '@/app/dashboard/dashboard-layout.component';
import { UsersPageComponent } from '@/app/dashboard/pages/users/users-page.component';

export const routes: Routes = [
  {
    path: '',
    component: DashboardLayoutComponent,
    children: [
      { path: 'users', component: UsersPageComponent },
      { path: '', redirectTo: 'users', pathMatch: 'full' },
    ],
  },
];
