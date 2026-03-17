import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { AuthStore } from '@/core/data-access/stores/auth-store/auth.store';

export const guestGuard: CanActivateFn = () => {
  const router = inject(Router);
  const authStore = inject(AuthStore);

  return authStore.isAuthenticated() ? router.createUrlTree(['/']) : true;
};
