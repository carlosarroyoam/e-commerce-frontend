import {
  DEFAULT_FIRST_PAGE,
  DEFAULT_PAGE_SIZE,
} from '@/core/constants/pagination.constants';
import { PaginationResponse } from '@/core/data-access/interfaces/pagination-response';
import { UserQueryParams } from '@/features/user/data-access/interfaces/user-query-params';
import { UserResponse } from '@/features/user/data-access/interfaces/user-response';

export interface UserState {
  items: UserResponse[];
  pagination: PaginationResponse;
  queryParams: UserQueryParams;
  isLoading: boolean;
  error: string | null;
}

export const initialState: UserState = {
  items: [],
  pagination: {
    page: DEFAULT_FIRST_PAGE,
    size: 0,
    totalItems: 0,
    totalPages: 0,
  },
  queryParams: {
    page: DEFAULT_FIRST_PAGE,
    size: DEFAULT_PAGE_SIZE,
  },
  isLoading: false,
  error: null,
};
