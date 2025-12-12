import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { finalize } from 'rxjs';

import { AuthService } from '@/core/services/auth-service';
import { SessionService } from '@/core/services/session-service';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  const authService = inject(AuthService);
  const sessionService = inject(SessionService);

  if (!sessionService.isUserAuth()) {
    authService
      .logout()
      .pipe(finalize(() => router.navigate(['/auth/login'])))
      .subscribe();

    return false;
  }

  return true;
};
