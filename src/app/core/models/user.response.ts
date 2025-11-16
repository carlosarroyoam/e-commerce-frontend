import { User } from '@/app/core/models/user.model';

export interface UserResponse {
  message: string;
  user: User;
}
