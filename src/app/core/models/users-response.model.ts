import { Pagination } from './pagination.model';
import { User } from './user.model';

export interface UsersResponse {
  message: string;
  users: User[];
  pagination: Pagination;
}
