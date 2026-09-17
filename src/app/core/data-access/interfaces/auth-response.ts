import { UserResponse } from '@/features/user/data-access/interfaces/user-response';

/**
 * Respuesta del endpoint de inicio de sesión, con el usuario autenticado y su token de acceso.
 */
export type AuthResponse = Pick<UserResponse, 'id' | 'first_name' | 'last_name' | 'email'> & {
  roles: string[];
  access_token: string;
};
