import { computed, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, finalize, of, pipe, switchMap, tap } from 'rxjs';

import { LoginRequest } from '@/core/data-access/interfaces/login-request';
import { AuthService } from '@/core/data-access/services/auth-service/auth-service';
import { SessionService } from '@/core/data-access/services/session-service/session-service';
import { initialState } from './auth.state';

export const AuthStore = signalStore(
  { providedIn: 'root' },

  withState(initialState),

  withComputed((store) => ({
    fullName: computed(() =>
      store.user()
        ? `${store.user()!.first_name} ${store.user()!.last_name}`
        : null,
    ),
  })),

  withMethods(
    (
      store,
      authService = inject(AuthService),
      sessionService = inject(SessionService),
      router = inject(Router),
      route = inject(ActivatedRoute),
    ) => ({
      /**
       * Login
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
              tap(() => {
                const session = sessionService.getSession();

                patchState(store, {
                  user: session,
                  isAuthenticated: true,
                });

                const returnUrl =
                  route.snapshot.queryParamMap.get('returnUrl') ?? '/';

                router.navigateByUrl(returnUrl);
              }),

              catchError((error) => {
                patchState(store, {
                  error: error?.error?.message ?? 'Login failed',
                });

                return of(null);
              }),

              finalize(() =>
                patchState(store, {
                  isLoading: false,
                }),
              ),
            ),
          ),
        ),
      ),

      /**
       * Logout
       */
      logout: rxMethod<void>(
        pipe(
          tap(() =>
            patchState(store, {
              isLoading: true,
            }),
          ),

          switchMap(() =>
            authService.logout().pipe(
              tap(() => {
                patchState(store, {
                  user: null,
                  isAuthenticated: false,
                });

                router.navigate(['/auth/login']);
              }),

              finalize(() =>
                patchState(store, {
                  isLoading: false,
                }),
              ),
            ),
          ),
        ),
      ),
    }),
  ),

  withHooks({
    /**
     * Initialize store from localStorage
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
