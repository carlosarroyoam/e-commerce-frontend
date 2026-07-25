import { inject } from '@angular/core';
import { tapResponse } from '@ngrx/operators';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import {
  catchError,
  finalize,
  map,
  Observable,
  of,
  pipe,
  switchMap,
  tap,
} from 'rxjs';

import { LoginRequest } from '@/core/data-access/interfaces/login-request';
import { AuthSession } from '@/core/data-access/interfaces/auth-session';
import { LoginResponse } from '@/core/data-access/interfaces/login-response';
import { RefreshTokenResponse } from '@/core/data-access/interfaces/refresh-token-response';
import { AuthService } from '@/core/data-access/services/auth-service/auth-service';
import { initialState } from '@/core/data-access/stores/auth-store/auth.state';
import { extractErrorMessage } from '@/core/utils/error.utils';

export const AuthStore = signalStore(
  { providedIn: 'root' },

  withState(initialState),

  withMethods((store, authService = inject(AuthService)) => {
    return {
      /**
       * Login.
       */
      login: rxMethod<LoginRequest>(
        pipe(
          tap(() => patchState(store, { isLoading: true, error: null })),
          switchMap((payload) =>
            authService.login(payload).pipe(
              tapResponse({
                next: (response) => {
                  patchState(store, {
                    accessToken: response.access_token,
                    authSession: toAuthSession(response),
                    isAuthenticated: true,
                  });
                },
                error: (error) =>
                  patchState(store, {
                    accessToken: null,
                    authSession: null,
                    isAuthenticated: false,
                    error: extractErrorMessage(error),
                  }),
              }),
              finalize(() => patchState(store, { isLoading: false })),
            ),
          ),
        ),
      ),

      /**
       * Refresh access token.
       */
      refreshAccessToken(): Observable<RefreshTokenResponse> {
        return authService.refreshToken().pipe(
          tap(() => patchState(store, { isLoading: true, error: null })),
          tapResponse({
            next: (response) => {
              patchState(store, {
                accessToken: response.access_token,
                authSession: toAuthSession(response),
                isAuthenticated: true,
              });
            },
            error: (error) => {
              patchState(store, {
                accessToken: null,
                authSession: null,
                isAuthenticated: false,
                error: extractErrorMessage(error),
              });
            },
          }),
          finalize(() => patchState(store, { isLoading: false })),
        );
      },

      /**
       * Restores the in-memory session during app startup.
       */
      restoreSession(): Observable<void> {
        return this.refreshAccessToken().pipe(
          map(() => undefined),
          catchError(() => of(undefined)),
        );
      },

      /**
       * Logout.
       */
      logout(): void {
        authService.logout().subscribe();

        patchState(store, {
          accessToken: null,
          authSession: null,
          isAuthenticated: false,
        });
      },
    };
  }),
);

const toAuthSession = (
  response: LoginResponse | RefreshTokenResponse,
): AuthSession => ({
  id: response.id,
  first_name: response.first_name,
  last_name: response.last_name,
  full_name: `${response.first_name} ${response.last_name}`,
  email: response.email,
  roles: response.roles,
});
