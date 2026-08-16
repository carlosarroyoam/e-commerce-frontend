import { DEFAULT_FIRST_PAGE } from '@/core/constants/pagination.constants';
import { PaginationResponse } from '@/core/data-access/interfaces/pagination-response';
import { ProductResponse } from '@/features/product/data-access/interfaces/product-response';

export interface ProductState {
  items: ProductResponse[];
  pagination: PaginationResponse;
  isLoading: boolean;
  error: string | null;
}

export const initialState: ProductState = {
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
