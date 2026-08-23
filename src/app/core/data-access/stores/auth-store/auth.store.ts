import { computed, inject } from '@angular/core';
import { tapResponse } from '@ngrx/operators';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, EMPTY, exhaustMap, map, Observable, of, pipe, tap } from 'rxjs';

import { AuthSession } from '@/core/data-access/interfaces/auth-session';
import { LoginRequest } from '@/core/data-access/interfaces/login-request';
import { AuthResponse } from '@/core/data-access/interfaces/auth-response';
import { AuthService } from '@/core/data-access/services/auth-service/auth-service';
import { initialState } from '@/core/data-access/stores/auth-store/auth.state';
import { extractErrorMessage } from '@/core/utils/error.utils';

/**
 * Gestiona el estado de autenticación: sesión en memoria, access token y estado de login.
 */
export const AuthStore = signalStore(
  { providedIn: 'root' },

  withState(initialState),

  withComputed((store) => ({
    isAuthenticated: computed(() => store.status() === 'authenticated'),
    isInitialized: computed(() => store.status() !== 'unknown'),
  })),

  withMethods((store, authService = inject(AuthService)) => {
    /**
     * Marca la sesión como autenticada y guarda el token y los datos de sesión.
     *
     * @param response Respuesta de autenticación recibida del backend.
     */
    const setAuthenticated = (response: AuthResponse | AuthResponse): void => {
      patchState(store, {
        status: 'authenticated',
        accessToken: response.access_token,
        authSession: toAuthSession(response),
        error: null,
      });
    };

    /**
     * Marca la sesión como no autenticada y limpia el token y los datos de sesión.
     *
     * @param error Mensaje de error a guardar en el estado, si aplica.
     */
    const setUnauthenticated = (error: string | null = null): void => {
      patchState(store, {
        status: 'unauthenticated',
        accessToken: null,
        authSession: null,
        error,
      });
    };

    return {
      /**
       * Autentica al usuario con sus credenciales.
       *
       * @param payload Credenciales de inicio de sesión.
       */
      login: rxMethod<LoginRequest>(
        pipe(
          tap(() => patchState(store, { isLoggingIn: true, error: null })),
          exhaustMap((payload) =>
            authService.login(payload).pipe(
              tapResponse({
                next: (response) => setAuthenticated(response),
                error: (error) => setUnauthenticated(extractErrorMessage(error)),
                finalize: () => patchState(store, { isLoggingIn: false }),
              }),
            ),
          ),
        ),
      ),

      /**
       * Solicita un nuevo access token y actualiza la sesión.
       *
       * @returns Observable con la respuesta de autenticación renovada.
       */
      refreshAccessToken(): Observable<AuthResponse> {
        return authService.refreshToken().pipe(
          tap({
            next: (response) => setAuthenticated(response),
            error: (error) => setUnauthenticated(extractErrorMessage(error)),
          }),
        );
      },

      /**
       * Restaura la sesión en memoria al iniciar la aplicación.
       *
       * @returns Observable que se completa cuando la restauración finaliza.
       */
      restoreSession(): Observable<void> {
        if (store.status() !== 'unknown') {
          return of(undefined);
        }

        return this.refreshAccessToken().pipe(
          map(() => undefined),
          catchError(() => of(undefined)),
        );
      },

      /**
       * Cierra la sesión del usuario.
       */
      logout(): void {
        setUnauthenticated();
        authService
          .logout()
          .pipe(catchError(() => EMPTY))
          .subscribe();
      },
    };
  }),
);

/**
 * Convierte la respuesta de autenticación al modelo de sesión usado por el store.
 *
 * @param response Respuesta de autenticación recibida del backend.
 * @returns El modelo de sesión derivado de la respuesta.
 */
const toAuthSession = (response: AuthResponse): AuthSession => ({
  id: response.id,
  first_name: response.first_name,
  last_name: response.last_name,
  full_name: `${response.first_name} ${response.last_name}`,
  email: response.email,
  roles: response.roles,
});
