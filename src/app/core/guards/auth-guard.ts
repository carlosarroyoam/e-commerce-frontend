import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';

import { AuthStore } from '@/core/data-access/store/auth.store';

export const authGuard: CanActivateFn = () => {
  const authStore = inject(AuthStore);

  if (!authStore.isAuthenticated()) {
    authStore.logout();

    return false;
  }

  return true;
};
