import { formatDate } from '@angular/common';
import { ColumnDef, flexRenderComponent } from '@tanstack/angular-table';

import { CustomerTableButtons } from '@/features/customer/components/customer-table-buttons/customer-table-buttons';
import {
  CustomerResponse,
  CustomerStatus,
} from '@/features/customer/data-access/interfaces/customer-response';
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

export function buildCustomerTableColumns(): ColumnDef<CustomerResponse>[] {
  return [
    {
      id: 'profile_picture',
      enableSorting: false,
      cell: () => flexRenderComponent(Avatar),
    },
    {
      accessorKey: 'first_name',
      header: 'Name',
      enableSorting: true,
      cell: (info) =>
        `${info.row.original.first_name} ${info.row.original.last_name}`,
    },
    {
      accessorKey: 'email',
      header: 'Email',
      enableSorting: true,
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: 'phone_number',
      header: 'Phone number',
      enableSorting: false,
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: 'created_at',
      header: 'Created at',
      enableSorting: false,
      cell: (info) =>
        formatDate(info.getValue() as string, 'dd/MM/yyyy hh:mm a', 'es-MX'),
    },
    {
      accessorKey: 'updated_at',
      header: 'Updated at',
      enableSorting: false,
      cell: (info) =>
        formatDate(info.getValue() as string, 'dd/MM/yyyy hh:mm a', 'es-MX'),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      enableSorting: false,
      cell: (info) => {
        const status = info.getValue() as CustomerStatus;
        const { label, variant } = CUSTOMER_STATUS_CONFIG[status];

        return flexRenderComponent(Chip, { inputs: { variant, label } });
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      enableSorting: false,
      cell: () => flexRenderComponent(CustomerTableButtons, { inputs: {} }),
    },
  ];
}
