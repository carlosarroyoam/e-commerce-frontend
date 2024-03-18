import { User } from './user.interface';

export interface UsersResponse {
  message: string;
  users: User[];
}
