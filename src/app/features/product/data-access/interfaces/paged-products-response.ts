import { PaginationResponse } from '@/core/data-access/interfaces/pagination-response';
import { ProductResponse } from '@/features/product/data-access/interfaces/product-response';

/**
 * Página de productos devuelta por el listado paginado de productos.
 */
export interface PagedProductsResponse {
  items: ProductResponse[];
  pagination: PaginationResponse;
}
