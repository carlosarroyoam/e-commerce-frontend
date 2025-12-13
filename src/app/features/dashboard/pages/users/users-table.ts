import { formatDate } from '@angular/common';
import { ColumnDef, FlexRenderComponent } from '@tanstack/angular-table';

import { User } from '@/core/interfaces/user';
import { Avatar } from '@/shared/components/ui/avatar/avatar';
import { Chip } from '@/shared/components/ui/chip/chip';
import { UsersTableButtons } from '@/shared/components/users-table-buttons/users-table-buttons';

export function buildUsersTableColumns(opts: {
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
}): ColumnDef<User>[] {
  return [
    {
      id: 'profile_picture',
      cell: () => new FlexRenderComponent(Avatar),
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
        return new FlexRenderComponent(Chip, {
          variant: deletedAt ? 'danger' : 'success',
          label: deletedAt ? 'Inactive' : 'Active',
        });
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: () =>
        new FlexRenderComponent(UsersTableButtons, {
          onEdit: opts.onEdit,
          onDelete: opts.onDelete,
        }),
    },
  ];
}
