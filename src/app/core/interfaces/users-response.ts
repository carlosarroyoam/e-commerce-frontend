import { Pagination } from '@/core/interfaces/pagination';
import { User } from '@/core/interfaces/user';

export interface UsersResponse {
  message: string;
  users: User[];
  pagination: Pagination;
}
