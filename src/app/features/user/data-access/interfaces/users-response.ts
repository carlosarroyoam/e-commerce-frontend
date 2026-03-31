import { Pagination } from '@/core/data-access/interfaces/pagination';
import { User } from '@/features/user/data-access/interfaces/user';

export interface UsersResponse {
  items: User[];
  pagination: Pagination;
}
