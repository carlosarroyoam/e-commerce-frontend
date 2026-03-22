import { inject, Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Params, Router } from '@angular/router';

import {
  DEFAULT_FIRST_PAGE,
  DEFAULT_PAGE_SIZE,
} from '@/core/constants/pagination.constants';
import { safeParsePositiveInt } from '@/core/utils/number.utils';
import { UsersRequestParams } from '@/features/user/data-access/interfaces/users-request-params';
import { UserStore } from '../data-access/store/user.store';

@Injectable()
export class UserQueryParamsService {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly store = inject(UserStore);

  constructor() {
    this.route.queryParams
      .pipe(takeUntilDestroyed())
      .subscribe((queryParams) => {
        const requestParams = this.mapRequestParams(queryParams);
        this.store.getAll(requestParams);
      });
  }

  public updateQueryParams(partial: Partial<UsersRequestParams>): void {
    const queryParams: Params = {};

    for (const key in partial) {
      const value = partial[key as keyof UsersRequestParams];

      queryParams[key] =
        value === undefined || value === null || value === '' ? null : value;
    }

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  }

  public resetQueryParams(): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        page: DEFAULT_FIRST_PAGE,
        size: DEFAULT_PAGE_SIZE,
      },
      replaceUrl: true,
    });
  }

  private mapRequestParams(params: Params): UsersRequestParams {
    return {
      search: params['search'],
      status: params['status'] as UsersRequestParams['status'],
      sort: params['sort'] as UsersRequestParams['sort'],
      page: safeParsePositiveInt(params['page'], DEFAULT_FIRST_PAGE),
      size: safeParsePositiveInt(params['size'], DEFAULT_PAGE_SIZE),
    };
  }
}
