import { CustomerStatus } from '@/features/customer/data-access/interfaces/customer-response';
import { ChipVariants } from '@/shared/components/ui/chip/chip';

/**
 * Etiqueta y variante de `Chip` con las que se representa cada estado de cliente.
 */
export const CUSTOMER_STATUS_CONFIG: Record<
  CustomerStatus,
  { label: string; variant: NonNullable<ChipVariants['variant']> }
> = {
  PENDING: { label: 'Pending', variant: 'warning' },
  ACTIVE: { label: 'Active', variant: 'success' },
  SUSPENDED: { label: 'Suspended', variant: 'warning' },
  DELETED: { label: 'Deleted', variant: 'danger' },
};
