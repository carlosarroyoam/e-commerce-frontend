import { ParamMap } from '@angular/router';

import { DEFAULT_FIRST_PAGE, DEFAULT_PAGE_SIZE } from '@/core/constants/pagination.constants';
import {
  parseEnumParam,
  parseIntParam,
  parseStringParam,
} from '@/core/routing/query-params-parsers';
import { UserQueryParams } from '@/features/user/data-access/interfaces/user-query-params';
import { USER_STATUSES } from '@/features/user/data-access/interfaces/user-response';

export const userQueryParamsDeserializer = (params: ParamMap): UserQueryParams => ({
  firstName: parseStringParam(params, 'firstName'),
  lastName: parseStringParam(params, 'lastName'),
  email: parseStringParam(params, 'email'),
  status: parseEnumParam(params, 'status', USER_STATUSES),
  startDate: parseStringParam(params, 'startDate'),
  endDate: parseStringParam(params, 'endDate'),
  roleIds: parseStringParam(params, 'roleIds'),
  page: parseIntParam(params, 'page', DEFAULT_FIRST_PAGE, 0),
  size: parseIntParam(params, 'size', DEFAULT_PAGE_SIZE, 1),
  sort: parseStringParam(params, 'sort'),
});
