import { PaymentStatus } from '@/features/order/data-access/interfaces/order-detail-response';
import { ChipVariants } from '@/shared/components/ui/chip/chip';

/**
 * Etiqueta y variante de `Chip` con las que se representa cada estado de pago.
 */
export const PAYMENT_STATUS_CONFIG: Record<
  PaymentStatus,
  { label: string; variant: NonNullable<ChipVariants['variant']> }
> = {
  PENDING: { label: 'Pending', variant: 'warning' },
  COMPLETED: { label: 'Completed', variant: 'success' },
  FAILED: { label: 'Failed', variant: 'danger' },
  CANCELLED: { label: 'Cancelled', variant: 'danger' },
  REFUNDED: { label: 'Refunded', variant: 'default' },
};
