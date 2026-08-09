import { PaginationResponse } from '@/core/data-access/interfaces/pagination-response';
import { OrderResponse } from '@/features/order/data-access/interfaces/order-response';

export interface PagedOrdersResponse {
  items: OrderResponse[];
  pagination: PaginationResponse;
}
