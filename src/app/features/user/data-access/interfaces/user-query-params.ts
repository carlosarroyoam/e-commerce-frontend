import { UserStatus } from '@/features/user/data-access/interfaces/user-response';

/**
 * Filtros, ordenamiento y paginación aceptados al consultar el listado de usuarios.
 */
export interface UserQueryParams {
  firstName?: string;
  lastName?: string;
  email?: string;
  status?: UserStatus;
  startDate?: string;
  endDate?: string;
  roleIds?: string;
  page?: number;
  size?: number;
  sort?: string;
}
