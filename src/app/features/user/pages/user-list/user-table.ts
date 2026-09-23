import { ColumnDef, flexRenderComponent } from '@tanstack/angular-table';

import { formatDateTime } from '@/core/utils/date.utils';
import { UserTableButtons } from '@/features/user/components/user-table-buttons/user-table-buttons';
import {
  RoleResponse,
  UserResponse,
  UserStatus,
} from '@/features/user/data-access/interfaces/user-response';
import { USER_STATUS_CONFIG } from '@/features/user/utils/user-status';
import { AppTableFeatures } from '@/shared/components/table/tanstack/table-features';
import { Avatar } from '@/shared/components/ui/avatar/avatar';
import { Chip } from '@/shared/components/ui/chip/chip';

/**
 * Meta de la tabla de usuarios: callbacks de acciones disponibles vía `table.options.meta`.
 */
export interface UserTableMeta {
  onView?: (user: UserResponse) => void;
  onEdit?: (user: UserResponse) => void;
  onDelete?: (user: UserResponse) => void;
  onRestore?: (user: UserResponse) => void;
}

/**
 * Construye las columnas de la tabla de usuarios: foto, nombre, correo, roles, fecha de creación,
 * estado y acciones.
 *
 * @returns Definición de columnas para TanStack Table.
 */
export function buildUserTableColumns(): ColumnDef<AppTableFeatures, UserResponse>[] {
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
      accessorKey: 'roles',
      header: 'Roles',
      enableSorting: false,
      cell: (info) =>
        info
          .getValue<RoleResponse[]>()
          .map((role) => role.name)
          .join(', '),
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
        const { label, variant } = USER_STATUS_CONFIG[info.getValue<UserStatus>()];
        return flexRenderComponent(Chip, { inputs: { variant, label } });
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: () => flexRenderComponent(UserTableButtons),
    },
  ];
}
