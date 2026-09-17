import { PaginationResponse } from '@/core/data-access/interfaces/pagination-response';
import { CustomerResponse } from '@/features/customer/data-access/interfaces/customer-response';

/**
 * Página de clientes devuelta por el listado paginado de clientes.
 */
export interface PagedCustomersResponse {
  items: CustomerResponse[];
  pagination: PaginationResponse;
}
