import { PaginationResponse } from '@/core/data-access/interfaces/pagination-response';
import { CustomerResponse } from '@/features/customer/data-access/interfaces/customer-response';

export interface PagedCustomersResponse {
  items: CustomerResponse[];
  pagination: PaginationResponse;
}
