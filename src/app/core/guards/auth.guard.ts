import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';

import { AuthService } from '@/app/core/services/auth.service';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);

  if (!authService.isAuthenticated()) {
    authService.logout();
    return false;
  }

  return true;
};
