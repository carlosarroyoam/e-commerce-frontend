import { UserResponse } from '@/features/user/data-access/interfaces/user-response';

export type Session = Pick<
  UserResponse,
  'id' | 'first_name' | 'last_name' | 'email'
> & {
  roles: string[];
  full_name: string;
};
