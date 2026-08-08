import { PaginationResponse } from '@/core/data-access/interfaces/pagination-response';
import { CategoryResponse } from '@/features/category/data-access/interfaces/category-response';

export interface PagedCategoriesResponse {
  items: CategoryResponse[];
  pagination: PaginationResponse;
}
