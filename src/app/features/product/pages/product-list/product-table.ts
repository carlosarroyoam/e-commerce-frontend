import { ColumnDef, flexRenderComponent } from '@tanstack/angular-table';

import { formatDateTime } from '@/core/utils/date.utils';
import { ProductTableButtons } from '@/features/product/components/product-table-buttons/product-table-buttons';
import { ProductResponse } from '@/features/product/data-access/interfaces/product-response';
import { Chip } from '@/shared/components/ui/chip/chip';
import { AppTableFeatures } from '@/shared/components/table/tanstack/table-features';

/**
 * Meta de la tabla de productos: callbacks de acciones disponibles vía `table.options.meta`.
 */
export interface ProductTableMeta {
  onDelete?: (product: ProductResponse) => void;
}

/**
 * Construye las columnas de la tabla de productos: título, categoría, destacado, estado, fecha de
 * creación y acciones.
 *
 * @returns Definición de columnas para TanStack Table.
 */
export function buildProductTableColumns(): ColumnDef<AppTableFeatures, ProductResponse>[] {
  return [
    {
      accessorKey: 'title',
      header: 'Title',
      enableSorting: true,
      cell: (info) => info.getValue<string>(),
    },
    {
      id: 'category',
      header: 'Category',
      enableSorting: false,
      cell: (info) => {
        const categoryTitle = info.row.original.category?.title;
        return categoryTitle ?? '-';
      },
    },
    {
      accessorKey: 'is_featured',
      header: 'Featured',
      enableSorting: false,
      cell: (info) => {
        const isFeatured = info.getValue<boolean>();

        return flexRenderComponent(Chip, {
          inputs: {
            variant: isFeatured ? 'success' : 'warning',
            label: isFeatured ? 'Featured' : 'Not featured',
          },
        });
      },
    },
    {
      accessorKey: 'is_active',
      header: 'Status',
      enableSorting: false,
      cell: (info) => {
        const isActive = info.getValue<boolean>();

        return flexRenderComponent(Chip, {
          inputs: {
            variant: isActive ? 'success' : 'danger',
            label: isActive ? 'Active' : 'Inactive',
          },
        });
      },
    },
    {
      accessorKey: 'created_at',
      header: 'Created at',
      enableSorting: false,
      cell: (info) => formatDateTime(info.getValue<string>()),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: () => flexRenderComponent(ProductTableButtons),
    },
  ];
}
