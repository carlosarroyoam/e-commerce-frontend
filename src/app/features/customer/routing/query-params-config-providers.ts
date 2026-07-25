import { inject } from '@angular/core';
import { Params } from '@angular/router';

import {
  DEFAULT_FIRST_PAGE,
  DEFAULT_PAGE_SIZE,
} from '@/core/constants/pagination.constants';
import { QueryParamsConfig } from '@/core/routing/query-params.service';
import { safeParsePositiveInt } from '@/core/utils/number.utils';
import { CustomerQueryParams } from '@/features/customer/data-access/interfaces/customer-query-params';
import { CustomerStore } from '@/features/customer/data-access/store/customer.store';

export const provideCustomerQueryParamsConfig =
  (): QueryParamsConfig<CustomerQueryParams> => {
    const store = inject(CustomerStore);

    return {
      load: (params) => store.findAll(params),
      mapFromRoute: (params: Params) => ({
        firstName: params['firstName'],
        lastName: params['lastName'],
        email: params['email'],
        status: params['status'] as CustomerQueryParams['status'],
        startDate: params['startDate'],
        endDate: params['endDate'],
        page: safeParsePositiveInt(params['page'], DEFAULT_FIRST_PAGE),
        size: safeParsePositiveInt(params['size'], DEFAULT_PAGE_SIZE),
        sort: params['sort'],
      }),
      resetQueryParams: {
        page: DEFAULT_FIRST_PAGE,
        size: DEFAULT_PAGE_SIZE,
      },
    };
  };
