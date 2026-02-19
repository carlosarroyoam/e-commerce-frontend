import { inject } from '@angular/core';
import {
  patchState,
  signalStore,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, finalize, of, pipe, switchMap, tap } from 'rxjs';

import { LoginRequest } from '@/core/data-access/interfaces/login-request';
import { AuthService } from '@/core/data-access/services/auth-service/auth-service';
import { SessionService } from '@/core/data-access/services/session-service/session-service';
import { initialState } from '@/core/data-access/store/auth-store/auth.state';
import { extractErrorMessage } from '@/core/utils/error.utils';

export const AuthStore = signalStore(
  { providedIn: 'root' },

  withState(initialState),

  withMethods(
    (
      store,
      authService = inject(AuthService),
      sessionService = inject(SessionService),
    ) => ({
      /**
       * Login.
       */
      login: rxMethod<LoginRequest>(
        pipe(
          tap(() =>
            patchState(store, {
              isLoading: true,
              error: null,
            }),
          ),
          switchMap((loginRequest) =>
            authService.login(loginRequest).pipe(
              tap((response) => {
                sessionService.saveSession(response.user);

                patchState(store, {
                  user: sessionService.getSession(),
                  isAuthenticated: true,
                });
              }),
              catchError((err) => {
                patchState(store, {
                  error: extractErrorMessage(err),
                });

                return of(null);
              }),
              finalize(() => patchState(store, { isLoading: false })),
            ),
          ),
        ),
      ),

      /**
       * Logout.
       */
      logout(): void {
        authService.logout().subscribe();
        sessionService.clearSession();

        patchState(store, {
          user: null,
          isAuthenticated: false,
        });
      },
    }),
  ),

  withHooks({
    /**
     * Initializes store from localStorage.
     */
    onInit(store, sessionService = inject(SessionService)) {
      const session = sessionService.getSession();

      if (session) {
        patchState(store, {
          user: session,
          isAuthenticated: true,
        });
      }
    },
  }),
);
