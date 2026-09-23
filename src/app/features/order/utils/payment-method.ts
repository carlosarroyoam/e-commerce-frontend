import { PaymentMethod } from '@/features/order/data-access/interfaces/order-detail-response';

/**
 * Etiqueta legible con la que se representa cada método de pago.
 */
export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  CASH_ON_DELIVERY: 'Cash on delivery',
  CREDIT_CARD: 'Credit card',
  DEBIT_CARD: 'Debit card',
  BANK_TRANSFER: 'Bank transfer',
};
