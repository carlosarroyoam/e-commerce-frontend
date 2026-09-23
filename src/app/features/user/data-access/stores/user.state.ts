import { DEFAULT_FIRST_PAGE } from '@/core/constants/pagination.constants';
import { PaginationResponse } from '@/core/data-access/interfaces/pagination-response';
import { UserResponse } from '@/features/user/data-access/interfaces/user-response';

export interface UserState {
  items: UserResponse[];
  selectedItem: UserResponse | null;
  pagination: PaginationResponse;
  isLoading: boolean;
  error: string | null;
}

export const initialState: UserState = {
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
