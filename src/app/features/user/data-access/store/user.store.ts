import { inject } from '@angular/core';
import { tapResponse } from '@ngrx/operators';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { finalize, pipe, switchMap, tap } from 'rxjs';

import { extractErrorMessage } from '@/core/utils/error.utils';
import { UserQueryParams } from '@/features/user/data-access/interfaces/user-query-params';
import { UserService } from '@/features/user/data-access/services/user-service';
import { initialState } from '@/features/user/data-access/store/user.state';

export const UserStore = signalStore(
  { providedIn: undefined },

  withState(initialState),

  withMethods((store, userService = inject(UserService)) => ({
    /**
     * Gets all users.
     */
    getAll: rxMethod<UserQueryParams>(
      pipe(
        tap((queryParams) =>
          patchState(store, { queryParams, isLoading: true, error: null }),
        ),
        switchMap((queryParams) =>
          userService.getAll(queryParams).pipe(
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
