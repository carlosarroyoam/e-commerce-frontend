import { User } from '@/app/core/models/user.model';

export interface LoginResponse {
  message: string;
  user: Pick<
    User,
    'id' | 'email' | 'first_name' | 'last_name' | 'user_role_id' | 'user_role'
  >;
}
