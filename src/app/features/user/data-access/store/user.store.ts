import { effect, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import {
  patchState,
  signalStore,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, of, pipe, switchMap, tap } from 'rxjs';

import {
  DEFAULT_FIRST_PAGE,
  DEFAULT_PAGE_SIZE,
} from '@/core/constants/pagination.constants';
import { Pagination } from '@/core/interfaces/pagination';
import { extractErrorMessage } from '@/core/utils/error.utils';
import { User } from '@/features/user/data-access/interfaces/user';
import { UsersRequestParams } from '@/features/user/data-access/interfaces/users-request';
import { UserService } from '@/features/user/data-access/services/user-service';

export interface UserState {
  users: User[];
  pagination: Pagination;
  requestParams: UsersRequestParams;
  isLoading: boolean;
  error: string | null;
}

const initialState: UserState = {
  users: [],
  pagination: {
    page: 1,
    size: 0,
    totalItems: 0,
    totalPages: 1,
  },
  requestParams: {
    page: DEFAULT_FIRST_PAGE,
    size: DEFAULT_PAGE_SIZE,
  },
  isLoading: false,
  error: null,
};

export const UserStore = signalStore(
  { providedIn: 'root' },

  withState(initialState),

  withMethods(
    (
      store,
      userService = inject(UserService),
      router = inject(Router),
      route = inject(ActivatedRoute),
    ) => ({
      loadAll: rxMethod<{ requestParams?: UsersRequestParams }>(
        pipe(
          tap(() => patchState(store, { isLoading: true, error: null })),
          switchMap(({ requestParams = store.requestParams() }) =>
            userService.getAll(requestParams).pipe(
              tap((response) => {
                if (response) {
                  patchState(store, {
                    users: response.users,
                    pagination: response.pagination,
                    isLoading: false,
                  });
                }
              }),
              catchError((err) => {
                patchState(store, {
                  isLoading: false,
                  error: extractErrorMessage(err),
                });

                return of(null);
              }),
            ),
          ),
        ),
      ),

      navigate(
        page: number,
        size: number,
        search?: string,
        status?: 'active' | 'inactive',
      ) {
        router.navigate([], {
          relativeTo: route,
          queryParams: {
            page,
            size,
            search,
            status,
          },
          queryParamsHandling: 'merge',
          replaceUrl: true,
        });
      },

      reset() {
        router.navigate([], {
          relativeTo: route,
          queryParams: {
            page: DEFAULT_FIRST_PAGE,
            size: DEFAULT_PAGE_SIZE,
            search: undefined,
            status: undefined,
          },
          replaceUrl: true,
        });
      },
    }),
  ),

  withHooks((store, route = inject(ActivatedRoute)) => ({
    onInit() {
      const queryParams = toSignal(route.queryParamMap);

      effect(() => {
        const params = queryParams();

        if (!params) return;

        const requestParams: UsersRequestParams = {
          page: Number(params.get('page') ?? DEFAULT_FIRST_PAGE),
          size: Number(params.get('size') ?? DEFAULT_PAGE_SIZE),
          search: params.get('search') ?? undefined,
          status:
            (params.get('status') as 'active' | 'inactive' | undefined) ??
            undefined,
        };

        patchState(store, { requestParams });

        store.loadAll({
          requestParams,
        });
      });
    },
  })),
);
