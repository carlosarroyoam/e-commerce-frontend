import { ParamMap } from '@angular/router';

import { DEFAULT_FIRST_PAGE, DEFAULT_PAGE_SIZE } from '@/core/constants/pagination.constants';
import { parseIntParam, parseStringParam } from '@/core/routing/query-params-parsers';
import { CategoryQueryParams } from '@/features/category/data-access/interfaces/category-query-params';

export const categoryQueryParamsDeserializer = (params: ParamMap): CategoryQueryParams => ({
  page: parseIntParam(params, 'page', DEFAULT_FIRST_PAGE, 0),
  size: parseIntParam(params, 'size', DEFAULT_PAGE_SIZE, 1),
  sort: parseStringParam(params, 'sort'),
});
