import { Pagination } from '@/core/models/pagination.model';
import { User } from '@/core/models/user.model';

export interface UsersResponse {
  message: string;
  users: User[];
  pagination: Pagination;
}
