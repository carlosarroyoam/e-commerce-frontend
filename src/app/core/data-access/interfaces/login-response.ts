import { User } from '@/features/user/data-access/interfaces/user';

export interface LoginResponse {
  message: string;
  user: Pick<
    User,
    'id' | 'first_name' | 'last_name' | 'email' | 'user_role' | 'user_role_id'
  >;
}
