import { ColumnDef, flexRenderComponent } from '@tanstack/angular-table';

import { formatDateTime } from '@/core/utils/date.utils';
import { CustomerTableButtons } from '@/features/customer/components/customer-table-buttons/customer-table-buttons';
import {
  CustomerResponse,
  CustomerStatus,
} from '@/features/customer/data-access/interfaces/customer-response';
import { AppTableFeatures } from '@/shared/components/table/tanstack/table-features';
import { Avatar } from '@/shared/components/ui/avatar/avatar';
import { Chip, ChipVariants } from '@/shared/components/ui/chip/chip';

const CUSTOMER_STATUS_CONFIG: Record<
  CustomerStatus,
  { label: string; variant: NonNullable<ChipVariants['variant']> }
> = {
  PENDING: { label: 'Pending', variant: 'warning' },
  ACTIVE: { label: 'Active', variant: 'success' },
  SUSPENDED: { label: 'Suspended', variant: 'warning' },
  DELETED: { label: 'Deleted', variant: 'danger' },
};

/**
 * Construye las columnas de la tabla de clientes: foto, nombre, correo, teléfono, fecha de
 * creación, estado y acciones.
 *
 * @returns Definición de columnas para TanStack Table.
 */
export function buildCustomerTableColumns(): ColumnDef<AppTableFeatures, CustomerResponse>[] {
  return [
    {
      id: 'profile_picture',
      cell: (info) => {
        const { first_name: firstName, last_name: lastName } = info.row.original;

        return flexRenderComponent(Avatar, {
          inputs: {
            firstName,
            lastName,
          },
        });
      },
    },
    {
      id: 'first_name',
      header: 'Name',
      enableSorting: true,
      accessorFn: (row) => {
        return `${row.first_name} ${row.last_name}`;
      },
    },
    {
      accessorKey: 'email',
      header: 'Email',
      enableSorting: true,
      cell: (info) => info.getValue<string>(),
    },
    {
      accessorKey: 'phone_number',
      header: 'Phone number',
      enableSorting: false,
      cell: (info) => info.getValue<string>(),
    },
    {
      accessorKey: 'created_at',
      header: 'Created at',
      enableSorting: false,
      cell: (info) => formatDateTime(info.getValue<string>()),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      enableSorting: false,
      cell: (info) => {
        const { label, variant } = CUSTOMER_STATUS_CONFIG[info.getValue<CustomerStatus>()];
        return flexRenderComponent(Chip, { inputs: { variant, label } });
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: () => flexRenderComponent(CustomerTableButtons, { inputs: {} }),
    },
  ];
}
