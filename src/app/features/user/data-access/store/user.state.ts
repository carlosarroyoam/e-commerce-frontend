import {
  DEFAULT_FIRST_PAGE,
  DEFAULT_PAGE_SIZE,
} from '@/core/constants/pagination.constants';
import { PaginationResponse } from '@/core/data-access/interfaces/pagination-response';
import { UserResponse } from '@/features/user/data-access/interfaces/user-response';
import { UsersRequestParams } from '@/features/user/data-access/interfaces/users-request-params';

export interface UserState {
  items: UserResponse[];
  pagination: PaginationResponse;
  requestParams: UsersRequestParams;
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
  requestParams: {
    page: DEFAULT_FIRST_PAGE,
    size: DEFAULT_PAGE_SIZE,
  },
  isLoading: false,
  error: null,
};
