export const ORDER_STATUSES = [
  'PENDING',
  'CONFIRMED',
  'PROCESSING',
  'SHIPPED',
  'DELIVERED',
  'CANCELLED',
  'REFUNDED',
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

export interface OrderCustomerResponse {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
}

export interface OrderResponse {
  id: number;
  order_number: string;
  subtotal: number;
  tax_total: number;
  shipping_total: number;
  total: number;
  notes: string | null;
  status: OrderStatus;
  customer: OrderCustomerResponse;
  created_at: string;
  updated_at: string;
}
