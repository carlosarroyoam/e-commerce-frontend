import { DEFAULT_FIRST_PAGE } from '@/core/constants/pagination.constants';
import { PaginationResponse } from '@/core/data-access/interfaces/pagination-response';
import { OrderResponse } from '@/features/order/data-access/interfaces/order-response';

export interface OrderState {
  items: OrderResponse[];
  pagination: PaginationResponse;
  isLoading: boolean;
  error: string | null;
}

export const initialState: OrderState = {
  items: [],
  pagination: {
    page: DEFAULT_FIRST_PAGE,
    size: 0,
    total_items: 0,
    total_pages: 0,
  },
  isLoading: false,
  error: null,
};
