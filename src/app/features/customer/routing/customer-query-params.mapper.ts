import { ParamMap } from '@angular/router';

import { DEFAULT_FIRST_PAGE, DEFAULT_PAGE_SIZE } from '@/core/constants/pagination.constants';
import { safeParseInt } from '@/core/utils/number.utils';
import { CustomerQueryParams } from '@/features/customer/data-access/interfaces/customer-query-params';

export const mapCustomerQueryParams = (params: ParamMap): CustomerQueryParams => ({
  firstName: params.get('firstName') ?? undefined,
  lastName: params.get('lastName') ?? undefined,
  email: params.get('email') ?? undefined,
  status: (params.get('status') ?? undefined) as CustomerQueryParams['status'],
  startDate: params.get('startDate') ?? undefined,
  endDate: params.get('endDate') ?? undefined,
  page: safeParseInt(params.get('page'), DEFAULT_FIRST_PAGE, 0),
  size: safeParseInt(params.get('size'), DEFAULT_PAGE_SIZE, 1),
  sort: params.get('sort') ?? undefined,
});
