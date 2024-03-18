export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  user_role_id: number;
  user_role: string;
  created_at: string;
  updated_at: string;
  deleted_at: boolean | null;
}
