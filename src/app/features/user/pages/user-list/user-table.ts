import { formatDate } from '@angular/common';
import { ColumnDef, flexRenderComponent } from '@tanstack/angular-table';

import { UserTableButtons } from '@/features/user/components/user-table-buttons/user-table-buttons';
import {
  RoleResponse,
  UserResponse,
  UserStatus,
} from '@/features/user/data-access/interfaces/user-response';
import { Avatar } from '@/shared/components/ui/avatar/avatar';
import { Chip, ChipVariants } from '@/shared/components/ui/chip/chip';

const USER_STATUS_CONFIG: Record<
  UserStatus,
  { label: string; variant: NonNullable<ChipVariants['variant']> }
> = {
  ACTIVE: { label: 'Active', variant: 'success' },
  INACTIVE: { label: 'Inactive', variant: 'warning' },
  DELETED: { label: 'Deleted', variant: 'danger' },
};

export function buildUserTableColumns(opts: {
  onEdit: (user: UserResponse) => void;
  onDelete: (user: UserResponse) => void;
  onRestore: (user: UserResponse) => void;
}): ColumnDef<UserResponse>[] {
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
      cell: (info) => `${info.row.original.first_name} ${info.row.original.last_name}`,
    },
    {
      accessorKey: 'email',
      header: 'Email',
      enableSorting: true,
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: 'roles',
      header: 'Roles',
      enableSorting: false,
      cell: (info) => (info.getValue() as RoleResponse[]).map((role) => role.name).join(', '),
    },
    {
      accessorKey: 'created_at',
      header: 'Created at',
      enableSorting: false,
      cell: (info) => formatDate(info.getValue() as string, 'dd/MM/yyyy hh:mm a', 'es-MX'),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      enableSorting: false,
      cell: (info) => {
        const status = info.getValue() as UserStatus;
        const { label, variant } = USER_STATUS_CONFIG[status];

        return flexRenderComponent(Chip, {
          inputs: {
            variant,
            label,
          },
        });
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      enableSorting: false,
      cell: () =>
        flexRenderComponent(UserTableButtons, {
          inputs: {
            onEdit: opts.onEdit,
            onDelete: opts.onDelete,
            onRestore: opts.onRestore,
          },
        }),
    },
  ];
}
