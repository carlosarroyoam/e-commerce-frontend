import { formatDate } from '@angular/common';
import { ColumnDef, flexRenderComponent } from '@tanstack/angular-table';

import { User } from '@/features/user/data-access/interfaces/user';
import { UserTableButtons } from '@/features/user/components/user-table-buttons/user-table-buttons';
import { Avatar } from '@/shared/components/ui/avatar/avatar';
import { Chip } from '@/shared/components/ui/chip/chip';

export function buildUsersTableColumns(opts: {
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
  onRestore: (user: User) => void;
}): ColumnDef<User>[] {
  return [
    {
      id: 'profile_picture',
      cell: () => flexRenderComponent(Avatar),
    },
    {
      accessorFn: (row) => `${row.first_name} ${row.last_name}`,
      header: 'Name',
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: 'email',
      header: 'Email',
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: 'user_role',
      header: 'Role',
      cell: (info) => (info.getValue() as string).replace('App/', ''),
    },
    {
      accessorKey: 'created_at',
      header: 'Created at',
      cell: (info) =>
        formatDate(info.getValue() as string, 'dd/MM/yyyy hh:mm a', 'es-MX'),
    },
    {
      accessorKey: 'updated_at',
      header: 'Updated at',
      cell: (info) =>
        formatDate(info.getValue() as string, 'dd/MM/yyyy hh:mm a', 'es-MX'),
    },
    {
      accessorKey: 'deleted_at',
      header: 'Status',
      cell: (info) => {
        const deletedAt = info.getValue() as string;

        return flexRenderComponent(Chip, {
          inputs: {
            variant: deletedAt ? 'danger' : 'success',
            label: deletedAt ? 'Inactive' : 'Active',
          },
        });
      },
    },
    {
      id: 'actions',
      header: 'Actions',
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
