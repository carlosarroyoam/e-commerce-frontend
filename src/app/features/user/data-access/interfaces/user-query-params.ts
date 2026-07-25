import { UserStatus } from '@/features/user/data-access/interfaces/user-response';

export interface UserQueryParams {
  firstName?: string;
  lastName?: string;
  email?: string;
  status?: UserStatus;
  startDate?: string;
  endDate?: string;
  roleIds?: string;
  page?: number;
  size?: number;
  sort?: string;
}
