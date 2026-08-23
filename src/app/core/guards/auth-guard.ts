import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { AuthStore } from '@/core/data-access/stores/auth-store/auth.store';

/**
 * Permite el acceso solo a usuarios autenticados; de lo contrario redirige a login.
 *
 * @param _route Snapshot de la ruta activada (no usado).
 * @param state Estado del router al momento de la navegación.
 * @returns true si el acceso está permitido, o un UrlTree de redirección a login.
 */
export const authGuard: CanActivateFn = (_route, state) => {
  const router = inject(Router);
  const authStore = inject(AuthStore);

  return authStore.isAuthenticated()
    ? true
    : router.createUrlTree(['/auth/login'], {
        queryParams: { returnUrl: state.url },
      });
};
