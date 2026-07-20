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
  roles: RoleResponse[];
  created_at: string;
  updated_at: string;
  deleted_at: boolean | null;
}
