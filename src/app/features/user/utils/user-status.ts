import { UserStatus } from '@/features/user/data-access/interfaces/user-response';
import { ChipVariants } from '@/shared/components/ui/chip/chip';

/**
 * Etiqueta y variante de `Chip` con las que se representa cada estado de usuario.
 */
export const USER_STATUS_CONFIG: Record<
  UserStatus,
  { label: string; variant: NonNullable<ChipVariants['variant']> }
> = {
  ACTIVE: { label: 'Active', variant: 'success' },
  INACTIVE: { label: 'Inactive', variant: 'warning' },
  DELETED: { label: 'Deleted', variant: 'danger' },
};
