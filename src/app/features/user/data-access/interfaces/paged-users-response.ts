import { PaginationResponse } from '@/core/data-access/interfaces/pagination-response';
import { UserResponse } from '@/features/user/data-access/interfaces/user-response';

/**
 * Página de usuarios devuelta por el listado paginado de usuarios.
 */
export interface PagedUsersResponse {
  items: UserResponse[];
  pagination: PaginationResponse;
}
