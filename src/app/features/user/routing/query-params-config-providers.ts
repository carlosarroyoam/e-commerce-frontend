import { inject } from '@angular/core';
import { Params } from '@angular/router';

import {
  DEFAULT_FIRST_PAGE,
  DEFAULT_PAGE_SIZE,
} from '@/core/constants/pagination.constants';
import { QueryParamsConfig } from '@/core/routing/query-params.service';
import { safeParsePositiveInt } from '@/core/utils/number.utils';
import { UserQueryParams } from '@/features/user/data-access/interfaces/user-query-params';
import { UserStore } from '@/features/user/data-access/store/user.store';

export const provideUserQueryParamsConfig =
  (): QueryParamsConfig<UserQueryParams> => {
    const store = inject(UserStore);

    return {
      load: (params) => store.getAll(params),
      mapFromRoute: (params: Params) => ({
        search: params['search'],
        status: params['status'] as UserQueryParams['status'],
        sort: params['sort'] as UserQueryParams['sort'],
        page: safeParsePositiveInt(params['page'], DEFAULT_FIRST_PAGE),
        size: safeParsePositiveInt(params['size'], DEFAULT_PAGE_SIZE),
      }),
      resetQueryParams: {
        page: DEFAULT_FIRST_PAGE,
        size: DEFAULT_PAGE_SIZE,
      },
    };
  };
