import { Routes } from '@angular/router';

import { UserListPage } from '@/features/user/pages/user-list/user-list-page';
import { MainLayout } from '@/shared/components/layout/main-layout/main-layout';

export const routes: Routes = [
  {
    path: '',
    component: MainLayout,
    children: [{ path: '', component: UserListPage }],
  },
];
