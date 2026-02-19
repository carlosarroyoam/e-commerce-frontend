import {
  DEFAULT_FIRST_PAGE,
  DEFAULT_PAGE_SIZE,
} from '@/core/constants/pagination.constants';
import { Pagination } from '@/core/data-access/interfaces/pagination';
import { User } from '@/features/user/data-access/interfaces/user';
import { UsersRequestParams } from '@/features/user/data-access/interfaces/users-request';

export interface UserState {
  users: User[];
  pagination: Pagination;
  requestParams: UsersRequestParams;
  isLoading: boolean;
  error: string | null;
}

export const initialState: UserState = {
  users: [],
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
