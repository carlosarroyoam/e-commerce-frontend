export interface UserQueryParams {
  search?: string;
  status?: 'active' | 'inactive';
  page?: number;
  size?: number;
  sort?: string;
}
