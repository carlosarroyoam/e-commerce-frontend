import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { SessionService } from '@/core/services/session-service';

export const guestGuard: CanActivateFn = () => {
  const router = inject(Router);
  const sessionService = inject(SessionService);

  if (sessionService.isUserAuth()) {
    router.navigate(['/']);

    return false;
  }

  return true;
};
