import { ColumnDef, flexRenderComponent } from '@tanstack/angular-table';

import { formatDateTime } from '@/core/utils/date.utils';
import { UserTableButtons } from '@/features/user/components/user-table-buttons/user-table-buttons';
import {
  RoleResponse,
  UserResponse,
  UserStatus,
} from '@/features/user/data-access/interfaces/user-response';
import { AppTableFeatures } from '@/shared/components/table/tanstack/table-features';
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

/**
 * Construye las columnas de la tabla de usuarios: foto, nombre, correo, roles, fecha de creación,
 * estado y acciones.
 *
 * @param opts Callbacks de la tabla.
 * @returns Definición de columnas para TanStack Table.
 */
export function buildUserTableColumns(opts: {
  onEdit: (user: UserResponse) => void;
  onDelete: (user: UserResponse) => void;
  onRestore: (user: UserResponse) => void;
}): ColumnDef<AppTableFeatures, UserResponse>[] {
  return [
    {
      id: 'profile_picture',
      cell: (props) => {
        const { first_name: firstName, last_name: lastName } = props.row.original;

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
      cell: (props) => props.getValue<string>(),
    },
    {
      accessorKey: 'roles',
      header: 'Roles',
      enableSorting: false,
      cell: (props) =>
        props
          .getValue<RoleResponse[]>()
          .map((role) => role.name)
          .join(', '),
    },
    {
      accessorKey: 'created_at',
      header: 'Created at',
      enableSorting: false,
      cell: (props) => formatDateTime(props.getValue<string>()),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      enableSorting: false,
      cell: (props) => {
        const { label, variant } = USER_STATUS_CONFIG[props.getValue<UserStatus>()];
        return flexRenderComponent(Chip, { inputs: { variant, label } });
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
