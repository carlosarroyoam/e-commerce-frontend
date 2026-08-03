export type NavigationIcon =
  'dashboard' | 'orders' | 'products' | 'categories' | 'customers' | 'users';

export interface NavigationItem {
  id: string;
  label: string;
  route: string;
  icon?: NavigationIcon;
  allowedRoles?: readonly string[];
}
