export const USER_STATUSES = ['ACTIVE', 'INACTIVE', 'DELETED'] as const;

export type UserStatus = (typeof USER_STATUSES)[number];

export interface RoleResponse {
  id: number;
  name: string;
  description: string;
}

export interface UserResponse {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  status: UserStatus;
  roles: RoleResponse[];
  created_at: string;
  updated_at: string;
  deleted_at: boolean | null;
}
