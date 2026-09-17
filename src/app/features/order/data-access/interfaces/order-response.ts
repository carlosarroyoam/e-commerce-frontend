/**
 * Estados posibles de un pedido a lo largo de su ciclo de vida.
 */
export const ORDER_STATUSES = [
  'PENDING',
  'CONFIRMED',
  'PROCESSING',
  'SHIPPED',
  'DELIVERED',
  'CANCELLED',
  'REFUNDED',
] as const;

/**
 * Estado de un pedido, derivado de `ORDER_STATUSES`.
 */
export type OrderStatus = (typeof ORDER_STATUSES)[number];

/**
 * Datos del cliente asociado a un pedido.
 */
export interface OrderCustomerResponse {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
}

/**
 * Representa a un pedido tal como es devuelto por la API.
 */
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
