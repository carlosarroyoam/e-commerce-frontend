import {
  DEFAULT_FIRST_PAGE,
  DEFAULT_PAGE_SIZE,
} from '@/core/constants/pagination.constants';
import { PaginationResponse } from '@/core/data-access/interfaces/pagination-response';
import { CustomerQueryParams } from '@/features/customer/data-access/interfaces/customer-query-params';
import { CustomerResponse } from '@/features/customer/data-access/interfaces/customer-response';

export interface CustomerState {
  items: CustomerResponse[];
  pagination: PaginationResponse;
  queryParams: CustomerQueryParams;
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
  queryParams: {
    page: DEFAULT_FIRST_PAGE,
    size: DEFAULT_PAGE_SIZE,
  },
  isLoading: false,
  error: null,
};
