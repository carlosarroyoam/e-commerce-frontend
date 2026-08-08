import { ParamMap } from '@angular/router';

import { DEFAULT_FIRST_PAGE, DEFAULT_PAGE_SIZE } from '@/core/constants/pagination.constants';
import {
  parseEnumParam,
  parseIntParam,
  parseStringParam,
} from '@/core/routing/query-params-parsers';
import { CustomerQueryParams } from '@/features/customer/data-access/interfaces/customer-query-params';
import { CUSTOMER_STATUSES } from '@/features/customer/data-access/interfaces/customer-response';

export const customerQueryParamsDeserializer = (params: ParamMap): CustomerQueryParams => ({
  firstName: parseStringParam(params, 'firstName'),
  lastName: parseStringParam(params, 'lastName'),
  email: parseStringParam(params, 'email'),
  status: parseEnumParam(params, 'status', CUSTOMER_STATUSES),
  startDate: parseStringParam(params, 'startDate'),
  endDate: parseStringParam(params, 'endDate'),
  page: parseIntParam(params, 'page', DEFAULT_FIRST_PAGE, 0),
  size: parseIntParam(params, 'size', DEFAULT_PAGE_SIZE, 1),
  sort: parseStringParam(params, 'sort'),
});
