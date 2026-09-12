import type { SortingState } from '@tanstack/angular-table';

import { toCamelCase, toSnakeCase } from '@/core/utils/string.utils';

/**
 * Convierte el parámetro de query `sort` (formato `field,direction`) al estado de
 * ordenamiento de TanStack Table. Solo soporta ordenamiento de una columna.
 */
export const parseSortParam = (sort: string | undefined): SortingState => {
  if (!sort) return [];

  const [field, direction] = sort.split(',');

  if (!field) return [];

  return [{ id: toSnakeCase(field), desc: direction === 'desc' }];
};

/**
 * Convierte el estado de ordenamiento de TanStack Table al formato del parámetro de
 * query `sort` (`field,direction`). Solo soporta ordenamiento de una columna.
 */
export const sortingStateToParam = (sorting: SortingState): string | undefined => {
  const column = sorting[0];
  return column ? `${toCamelCase(column.id)},${column.desc ? 'desc' : 'asc'}` : undefined;
};
