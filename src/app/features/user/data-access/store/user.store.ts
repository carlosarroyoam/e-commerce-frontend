import { effect, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
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
import { safeParsePositiveInt } from '@/core/utils/number.utils';
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
      loadAll: rxMethod<UsersRequestParams>(
        pipe(
          tap(() => patchState(store, { isLoading: true, error: null })),
          switchMap((requestParams) =>
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

      updateRequestParams(partial: Partial<UsersRequestParams>): void {
        const current = store.requestParams();
        const next = { ...current, ...partial };

        router.navigate([], {
          relativeTo: route,
          queryParams: {
            page: next.page,
            size: next.size,
            search: next.search,
            status: next.status,
          },
          queryParamsHandling: 'merge',
          replaceUrl: true,
        });
      },

      reset(): void {
        router.navigate([], {
          relativeTo: route,
          queryParams: {
            page: DEFAULT_FIRST_PAGE,
            size: DEFAULT_PAGE_SIZE,
          },
          replaceUrl: true,
        });
      },
    }),
  ),

  withHooks((store, route = inject(ActivatedRoute)) => ({
    onInit(): void {
      const queryParamMap = toSignal(route.queryParamMap);

      effect(() => {
        const params = queryParamMap();
        if (!params) return;

        const next = mapRequestParams(params);
        const current = store.requestParams();

        if (!hasRequestChanged(current, next)) return;

        patchState(store, { requestParams: next });
      });

      effect(() => {
        const requestParams = store.requestParams();
        store.loadAll(requestParams);
      });
    },
  })),
);

const mapRequestParams = (
  params: URLSearchParams | ParamMap,
): UsersRequestParams => {
  return {
    page: safeParsePositiveInt(params.get('page'), DEFAULT_FIRST_PAGE),
    size: safeParsePositiveInt(params.get('size'), DEFAULT_PAGE_SIZE),
    search: params.get('search') ?? undefined,
    status:
      (params.get('status') as 'active' | 'inactive' | undefined) ?? undefined,
  };
};

const hasRequestChanged = (
  current: UsersRequestParams,
  next: UsersRequestParams,
): boolean => {
  return (
    current.page !== next.page ||
    current.size !== next.size ||
    current.search !== next.search ||
    current.status !== next.status
  );
};
