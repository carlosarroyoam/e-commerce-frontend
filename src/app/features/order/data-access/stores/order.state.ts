import { DEFAULT_FIRST_PAGE } from '@/core/constants/pagination.constants';
import { PaginationResponse } from '@/core/data-access/interfaces/pagination-response';
import { OrderDetailResponse } from '@/features/order/data-access/interfaces/order-detail-response';
import { OrderResponse } from '@/features/order/data-access/interfaces/order-response';

export interface OrderState {
  items: OrderResponse[];
  selectedItem: OrderDetailResponse | null;
  pagination: PaginationResponse;
  isLoading: boolean;
  error: string | null;
}

export const initialState: OrderState = {
  items: [],
  selectedItem: null,
  pagination: {
    page: DEFAULT_FIRST_PAGE,
    size: 0,
    total_items: 0,
    total_pages: 0,
  },
  isLoading: false,
  error: null,
};
