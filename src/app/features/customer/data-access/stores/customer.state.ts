import { DEFAULT_FIRST_PAGE } from '@/core/constants/pagination.constants';
import { PaginationResponse } from '@/core/data-access/interfaces/pagination-response';
import { CustomerResponse } from '@/features/customer/data-access/interfaces/customer-response';

export interface CustomerState {
  items: CustomerResponse[];
  pagination: PaginationResponse;
  isLoading: boolean;
  error: string | null;
}

export const initialState: CustomerState = {
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
