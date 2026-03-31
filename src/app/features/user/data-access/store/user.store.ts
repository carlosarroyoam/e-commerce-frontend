import { inject } from '@angular/core';
import { tapResponse } from '@ngrx/operators';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { finalize, pipe, switchMap, tap } from 'rxjs';

import { extractErrorMessage } from '@/core/utils/error.utils';
import { UsersRequestParams } from '@/features/user/data-access/interfaces/users-request-params';
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
            tapResponse({
              next: ({ items, pagination }) =>
                patchState(store, {
                  items,
                  pagination,
                }),
              error: (err) =>
                patchState(store, {
                  items: [],
                  pagination: { ...initialState.pagination },
                  error: extractErrorMessage(err),
                }),
            }),
            finalize(() => patchState(store, { isLoading: false })),
          ),
        ),
      ),
    ),
  })),
);
