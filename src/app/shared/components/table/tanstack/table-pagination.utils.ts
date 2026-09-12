import type { PaginationState } from '@tanstack/angular-table';

import { DEFAULT_FIRST_PAGE, DEFAULT_PAGE_SIZE } from '@/core/constants/pagination.constants';

/**
 * Convierte los parámetros de query `page`/`size` (cero-indexados) al estado de
 * paginación de TanStack Table.
 */
export const parsePaginationParam = (
  page: number | undefined,
  size: number | undefined,
): PaginationState => ({
  pageIndex: page ?? DEFAULT_FIRST_PAGE,
  pageSize: size ?? DEFAULT_PAGE_SIZE,
});
