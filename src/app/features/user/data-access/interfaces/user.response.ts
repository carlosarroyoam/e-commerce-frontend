import { User } from '@/features/user/data-access/interfaces/user';

export interface UserResponse {
  message: string;
  user: User;
}
