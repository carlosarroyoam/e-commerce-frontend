import { ColumnDef, flexRenderComponent } from '@tanstack/angular-table';

import { CategoryTableButtons } from '@/features/category/components/category-table-buttons/category-table-buttons';
import { CategoryResponse } from '@/features/category/data-access/interfaces/category-response';
import { Chip } from '@/shared/components/ui/chip/chip';
import { AppTableFeatures } from '@/shared/components/table/tanstack/table-features';

/**
 * Meta de la tabla de categorías: callbacks de acciones disponibles vía `table.options.meta`.
 */
export interface CategoryTableMeta {
  onView?: (category: CategoryResponse) => void;
  onDelete?: (category: CategoryResponse) => void;
}

/**
 * Construye las columnas de la tabla de categorías: título, slug, estado y acciones.
 *
 * @returns Definición de columnas para TanStack Table.
 */
export function buildCategoryTableColumns(): ColumnDef<AppTableFeatures, CategoryResponse>[] {
  return [
    {
      accessorKey: 'title',
      header: 'Title',
      enableSorting: true,
      cell: (info) => info.getValue<string>(),
    },
    {
      accessorKey: 'slug',
      header: 'Slug',
      enableSorting: true,
      cell: (info) => info.getValue<string>(),
    },
    {
      accessorKey: 'deleted_at',
      header: 'Status',
      enableSorting: false,
      cell: (info) => {
        const deletedAt = info.getValue<string | null>();

        return flexRenderComponent(Chip, {
          inputs: {
            variant: deletedAt ? 'danger' : 'success',
            label: deletedAt ? 'Deleted' : 'Active',
          },
        });
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: () => flexRenderComponent(CategoryTableButtons),
    },
  ];
}
