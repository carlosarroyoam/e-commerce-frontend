import { UserResponse } from '@/features/user/data-access/interfaces/user-response';

export type LoginResponse = Pick<
  UserResponse,
  'id' | 'first_name' | 'last_name' | 'email' | 'user_role' | 'user_role_id'
>;
