import { NavigationItem } from '@/shared/components/sidebar/interfaces/navigation-item';

export const SIDEBAR_NAVIGATION: readonly NavigationItem[] = [
  { id: 'dashboard', label: 'Dashboard', route: '/dashboard', icon: 'dashboard' },
  { id: 'orders', label: 'Orders', route: '/orders', icon: 'orders' },
  { id: 'products', label: 'Products', route: '/products', icon: 'products' },
  { id: 'categories', label: 'Categories', route: '/categories', icon: 'categories' },
  { id: 'customers', label: 'Customers', route: '/customers', icon: 'customers' },
  { id: 'users', label: 'Users', route: '/users', icon: 'users' },
];
