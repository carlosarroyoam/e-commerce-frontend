import { UserResponse } from '@/features/user/data-access/interfaces/user-response';

export type RefreshTokenResponse = Pick<
  UserResponse,
  'id' | 'first_name' | 'last_name' | 'email'
> & {
  roles: string[];
  access_token: string;
};
