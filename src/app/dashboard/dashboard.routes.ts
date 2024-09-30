import { Routes } from '@angular/router';

import { UsersPageComponent } from './pages/users/users-page.component';

export const routes: Routes = [
  {
    path: 'users',
    component: UsersPageComponent,
  },
  { path: '', redirectTo: 'users', pathMatch: 'full' },
];
