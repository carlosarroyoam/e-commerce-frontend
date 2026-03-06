export interface UsersRequestParams {
  page?: number;
  size?: number;
  sort?:
    | 'id'
    | '-id'
    | 'first_name'
    | '-first_name'
    | 'last_name'
    | '-last_name'
    | 'email'
    | '-email';
  search?: string;
  status?: 'active' | 'inactive';
}
