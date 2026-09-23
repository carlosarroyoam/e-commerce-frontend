import { OrderStatus } from '@/features/order/data-access/interfaces/order-response';
import { ChipVariants } from '@/shared/components/ui/chip/chip';

/**
 * Etiqueta y variante de `Chip` con las que se representa cada estado de orden.
 */
export const ORDER_STATUS_CONFIG: Record<
  OrderStatus,
  { label: string; variant: NonNullable<ChipVariants['variant']> }
> = {
  PENDING: { label: 'Pending', variant: 'warning' },
  CONFIRMED: { label: 'Confirmed', variant: 'warning' },
  PROCESSING: { label: 'Processing', variant: 'warning' },
  SHIPPED: { label: 'Shipped', variant: 'success' },
  DELIVERED: { label: 'Delivered', variant: 'success' },
  CANCELLED: { label: 'Cancelled', variant: 'danger' },
  REFUNDED: { label: 'Refunded', variant: 'danger' },
};
