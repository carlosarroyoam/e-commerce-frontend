import { ParamMap } from '@angular/router';

import { DEFAULT_FIRST_PAGE, DEFAULT_PAGE_SIZE } from '@/core/constants/pagination.constants';
import {
  parseBooleanParam,
  parseIntParam,
  parseStringParam,
} from '@/core/routing/query-params-parsers';
import { ProductQueryParams } from '@/features/product/data-access/interfaces/product-query-params';

export const productQueryParamsDeserializer = (params: ParamMap): ProductQueryParams => ({
  title: parseStringParam(params, 'title'),
  slug: parseStringParam(params, 'slug'),
  isFeatured: parseBooleanParam(params, 'isFeatured'),
  isActive: parseBooleanParam(params, 'isActive'),
  startDate: parseStringParam(params, 'startDate'),
  endDate: parseStringParam(params, 'endDate'),
  categoryId: parseIntParam(params, 'categoryId', undefined, 1),
  page: parseIntParam(params, 'page', DEFAULT_FIRST_PAGE, 0),
  size: parseIntParam(params, 'size', DEFAULT_PAGE_SIZE, 1),
  sort: parseStringParam(params, 'sort'),
});
