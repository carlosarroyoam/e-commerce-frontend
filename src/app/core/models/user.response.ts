import { User } from '@/core/models/user.model';

export interface UserResponse {
  message: string;
  user: User;
}
