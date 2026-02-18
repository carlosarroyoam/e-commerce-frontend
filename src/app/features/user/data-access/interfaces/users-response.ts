import { Pagination } from '@/core/interfaces/pagination';
import { User } from '@/features/user/data-access/interfaces/user';

export interface UsersResponse {
  message: string;
  users: User[];
  pagination: Pagination;
}
