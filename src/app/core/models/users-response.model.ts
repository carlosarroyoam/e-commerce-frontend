import { User } from '@/app/core/models/user.model';

export interface UsersResponse {
  message: string;
  users: User[];
}
