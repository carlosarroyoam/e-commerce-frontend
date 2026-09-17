import { UserResponse } from '@/features/user/data-access/interfaces/user-response';

/**
 * Sesión del usuario autenticado, tal como se mantiene en el estado de la aplicación.
 */
export type AuthSession = Pick<UserResponse, 'id' | 'first_name' | 'last_name' | 'email'> & {
  roles: string[];
  full_name: string;
};
