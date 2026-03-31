import { inject } from '@angular/core';
import { tapResponse } from '@ngrx/operators';
import {
  patchState,
  signalStore,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { finalize, pipe, switchMap, tap } from 'rxjs';

import { LoginRequest } from '@/core/data-access/interfaces/login-request';
import { AuthService } from '@/core/data-access/services/auth-service/auth-service';
import { SessionService } from '@/core/data-access/services/session-service/session-service';
import { initialState } from '@/core/data-access/stores/auth-store/auth.state';
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
          tap(() => patchState(store, { isLoading: true, error: null })),
          switchMap((loginRequest) =>
            authService.login(loginRequest).pipe(
              tapResponse({
                next: (user) => {
                  sessionService.saveSession(user);

                  patchState(store, {
                    session: sessionService.getSession(),
                    isAuthenticated: true,
                  });
                },
                error: (err) =>
                  patchState(store, { error: extractErrorMessage(err) }),
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
          session: null,
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
          session,
          isAuthenticated: true,
        });
      }
    },
  }),
);
