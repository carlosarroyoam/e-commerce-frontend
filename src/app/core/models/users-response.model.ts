import { Pagination } from '@/app/core/models/pagination.model';
import { User } from '@/app/core/models/user.model';

export interface UsersResponse {
  message: string;
  users: User[];
  pagination: Pagination;
}
