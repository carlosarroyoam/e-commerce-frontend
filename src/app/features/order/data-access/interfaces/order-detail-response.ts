import { OrderStatus } from '@/features/order/data-access/interfaces/order-response';

/**
 * Producto asociado a un artículo de una orden.
 */
export interface OrderItemProductResponse {
  id: number;
  title: string;
}

/**
 * Variante asociada a un artículo de una orden.
 */
export interface OrderItemVariantResponse {
  id: number;
  sku: string;
}

/**
 * Artículo de una orden.
 */
export interface OrderItemResponse {
  id: number;
  quantity: number;
  unit_price: number;
  total: number;
  product: OrderItemProductResponse;
  variant: OrderItemVariantResponse;
}

/**
 * Entrada del historial de estados de una orden.
 */
export interface OrderStatusHistoryResponse {
  id: number;
  notes: string | null;
  changed_at: string;
}

/**
 * Métodos de pago posibles para una orden.
 */
export const PAYMENT_METHODS = [
  'CASH_ON_DELIVERY',
  'CREDIT_CARD',
  'DEBIT_CARD',
  'BANK_TRANSFER',
] as const;

/**
 * Método de pago, derivado de `PAYMENT_METHODS`.
 */
export type PaymentMethod = (typeof PAYMENT_METHODS)[number];

/**
 * Estados posibles de un pago.
 */
export const PAYMENT_STATUSES = [
  'PENDING',
  'COMPLETED',
  'FAILED',
  'CANCELLED',
  'REFUNDED',
] as const;

/**
 * Estado de un pago, derivado de `PAYMENT_STATUSES`.
 */
export type PaymentStatus = (typeof PAYMENT_STATUSES)[number];

/**
 * Pago asociado a una orden.
 */
export interface OrderPaymentResponse {
  id: number;
  amount: number;
  reference: string | null;
  description: string | null;
  method: PaymentMethod;
  status: PaymentStatus;
  created_at: string;
  updated_at: string;
}

/**
 * Transportista asignado a un envío.
 */
export interface CarrierResponse {
  id: number;
  name: string;
  deleted_at: string | null;
}

/**
 * Envío asociado a una orden.
 */
export interface OrderShipmentResponse {
  id: number;
  carrier: CarrierResponse;
  tracking_number: string | null;
  shipped_at: string | null;
  delivered_at: string | null;
}

/**
 * Dirección de envío asignada a una orden.
 */
export interface OrderShippingAddressResponse {
  id: number;
  street_name: string;
  street_number: string;
  apartment_number: string | null;
  sublocality: string;
  locality: string;
  state: string;
  postal_code: string;
  country: string;
  phone_number: string;
}

/**
 * Cliente asociado a una orden, tal como se devuelve en el detalle de la orden.
 */
export interface OrderDetailCustomerResponse {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
}

/**
 * Representa el detalle completo de una orden tal como es devuelto por la API.
 */
export interface OrderDetailResponse {
  id: number;
  order_number: string;
  subtotal: number;
  tax_total: number;
  shipping_total: number;
  total: number;
  notes: string | null;
  status: OrderStatus;
  items: OrderItemResponse[];
  payments: OrderPaymentResponse[];
  shipments: OrderShipmentResponse[];
  status_history: OrderStatusHistoryResponse[];
  customer: OrderDetailCustomerResponse;
  shipping_address: OrderShippingAddressResponse;
  created_at: string;
  updated_at: string;
}
