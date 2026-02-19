import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, finalize, of, pipe, switchMap, tap } from 'rxjs';

import { extractErrorMessage } from '@/core/utils/error.utils';
import { UsersRequestParams } from '@/features/user/data-access/interfaces/users-request';
import { UserService } from '@/features/user/data-access/services/user-service';
import { initialState } from '@/features/user/data-access/store/user.state';

export const UserStore = signalStore(
  { providedIn: undefined },

  withState(initialState),

  withMethods((store, userService = inject(UserService)) => ({
    /**
     * Gets all users.
     */
    getAll: rxMethod<UsersRequestParams>(
      pipe(
        tap((requestParams) =>
          patchState(store, { requestParams, isLoading: true, error: null }),
        ),
        switchMap((requestParams) =>
          userService.getAll(requestParams).pipe(
            tap((response) => {
              if (response) {
                patchState(store, {
                  users: response.users,
                  pagination: response.pagination,
                });
              }
            }),
            catchError((err) => {
              patchState(store, {
                users: [],
                pagination: initialState.pagination,
                error: extractErrorMessage(err),
              });

              return of(null);
            }),
            finalize(() => patchState(store, { isLoading: false })),
          ),
        ),
      ),
    ),
  })),
);
