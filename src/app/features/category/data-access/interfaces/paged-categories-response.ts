import { PaginationResponse } from '@/core/data-access/interfaces/pagination-response';
import { CategoryResponse } from '@/features/category/data-access/interfaces/category-response';

/**
 * Página de categorías devuelta por el listado paginado de categorías.
 */
export interface PagedCategoriesResponse {
  items: CategoryResponse[];
  pagination: PaginationResponse;
}
