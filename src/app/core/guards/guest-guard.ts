import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { AuthStore } from '@/core/data-access/stores/auth-store/auth.store';

/**
 * Bloquea el acceso a rutas de invitado si el usuario ya está autenticado, redirigiendo al inicio.
 *
 * @returns true si el acceso está permitido, o un UrlTree de redirección al inicio.
 */
export const guestGuard: CanActivateFn = () => {
  const router = inject(Router);
  const authStore = inject(AuthStore);

  return authStore.isAuthenticated() ? router.createUrlTree(['/']) : true;
};
