import { PaginationResponse } from '@/core/data-access/interfaces/pagination-response';
import { ProductResponse } from '@/features/product/data-access/interfaces/product-response';

export interface PagedProductsResponse {
  items: ProductResponse[];
  pagination: PaginationResponse;
}
