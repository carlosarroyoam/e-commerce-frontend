import { computed, inject } from '@angular/core';
import { tapResponse } from '@ngrx/operators';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, EMPTY, finalize, map, Observable, of, pipe, switchMap, tap } from 'rxjs';

import { AuthSession } from '@/core/data-access/interfaces/auth-session';
import { LoginRequest } from '@/core/data-access/interfaces/login-request';
import { LoginResponse } from '@/core/data-access/interfaces/login-response';
import { RefreshTokenResponse } from '@/core/data-access/interfaces/refresh-token-response';
import { AuthService } from '@/core/data-access/services/auth-service/auth-service';
import { initialState } from '@/core/data-access/stores/auth-store/auth.state';
import { extractErrorMessage } from '@/core/utils/error.utils';

export const AuthStore = signalStore(
  { providedIn: 'root' },

  withState(initialState),

  withComputed((store) => ({
    isAuthenticated: computed(() => store.status() === 'authenticated'),
    isInitialized: computed(() => store.status() !== 'unknown'),
  })),

  withMethods((store, authService = inject(AuthService)) => {
    const setAuthenticated = (response: LoginResponse | RefreshTokenResponse): void => {
      patchState(store, {
        status: 'authenticated',
        accessToken: response.access_token,
        authSession: toAuthSession(response),
        error: null,
      });
    };

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
       * Authenticates a user.
       */
      login: rxMethod<LoginRequest>(
        pipe(
          tap(() => patchState(store, { isLoggingIn: true, error: null })),
          switchMap((payload) =>
            authService.login(payload).pipe(
              tapResponse({
                next: (response) => setAuthenticated(response),
                error: (error) => setUnauthenticated(extractErrorMessage(error)),
              }),
              finalize(() => patchState(store, { isLoggingIn: false })),
            ),
          ),
        ),
      ),

      /**
       * Refreshes access token.
       */
      refreshAccessToken(): Observable<RefreshTokenResponse> {
        return authService.refreshToken().pipe(
          tapResponse({
            next: (response) => setAuthenticated(response),
            error: (error) => setUnauthenticated(extractErrorMessage(error)),
          }),
        );
      },

      /**
       * Restores the in-memory session during app startup.
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
       * Logout.
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

const toAuthSession = (response: LoginResponse | RefreshTokenResponse): AuthSession => ({
  id: response.id,
  first_name: response.first_name,
  last_name: response.last_name,
  full_name: `${response.first_name} ${response.last_name}`,
  email: response.email,
  roles: response.roles,
});
