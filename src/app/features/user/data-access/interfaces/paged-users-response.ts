import { PaginationResponse } from '@/core/data-access/interfaces/pagination-response';
import { UserResponse } from '@/features/user/data-access/interfaces/user-response';

export interface PagedUsersResponse {
  items: UserResponse[];
  pagination: PaginationResponse;
}
