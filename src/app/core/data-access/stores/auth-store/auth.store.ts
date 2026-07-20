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
    ) => {
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
                    sessionService.save(response);

                    patchState(store, {
                      accessToken: response.access_token,
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
         * Refresh access token.
         */
        refreshAccessToken(): Observable<string> {
          return authService.refreshToken().pipe(
            tap((response) =>
              patchState(store, {
                accessToken: response.access_token,
                isAuthenticated: true,
              }),
            ),
            map((response) => response.access_token),
          );
        },

        /**
         * Logout.
         */
        logout(): void {
          authService
            .logout()
            .pipe(
              catchError((err) => {
                console.error(err);
                return of(undefined);
              }),
            )
            .subscribe();

          sessionService.clear();

          patchState(store, {
            accessToken: null,
            session: null,
            isAuthenticated: false,
          });
        },
      };
    },
  ),

  withHooks({
    /**
     * Initializes store from localStorage.
     */
    onInit(store, sessionService = inject(SessionService)) {
      const session = sessionService.getSession();

      if (session) {
        patchState(store, { session, isAuthenticated: true });
      }
    },
  }),
);
