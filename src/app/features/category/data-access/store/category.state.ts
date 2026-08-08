import { DEFAULT_FIRST_PAGE } from '@/core/constants/pagination.constants';
import { PaginationResponse } from '@/core/data-access/interfaces/pagination-response';
import { CategoryResponse } from '@/features/category/data-access/interfaces/category-response';

export interface CategoryState {
  items: CategoryResponse[];
  pagination: PaginationResponse;
  isLoading: boolean;
  error: string | null;
}

export const initialState: CategoryState = {
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
