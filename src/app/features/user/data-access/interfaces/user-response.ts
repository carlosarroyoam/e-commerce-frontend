/**
 * Estados posibles de un usuario a lo largo de su ciclo de vida.
 */
export const USER_STATUSES = ['ACTIVE', 'INACTIVE', 'DELETED'] as const;

/**
 * Estado de un usuario, derivado de `USER_STATUSES`.
 */
export type UserStatus = (typeof USER_STATUSES)[number];

/**
 * Rol asignado a un usuario.
 */
export interface RoleResponse {
  id: number;
  name: string;
  description: string;
}

/**
 * Representa a un usuario tal como es devuelto por la API.
 */
export interface UserResponse {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  status: UserStatus;
  roles: RoleResponse[];
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}
