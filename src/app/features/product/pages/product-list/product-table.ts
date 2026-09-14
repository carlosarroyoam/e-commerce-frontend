import { ColumnDef, flexRenderComponent } from '@tanstack/angular-table';

import { formatDateTime } from '@/core/utils/date.utils';
import { ProductTableButtons } from '@/features/product/components/product-table-buttons/product-table-buttons';
import { ProductResponse } from '@/features/product/data-access/interfaces/product-response';
import { Chip } from '@/shared/components/ui/chip/chip';
import { AppTableFeatures } from '@/shared/components/table/tanstack/table-features';

/**
 * Construye las columnas de la tabla de productos: título, categoría, destacado, estado, fecha de
 * creación y acciones.
 *
 * @param opts Callbacks de la tabla.
 * @returns Definición de columnas para TanStack Table.
 */
export function buildProductTableColumns(opts: {
  onDelete: (product: ProductResponse) => void;
}): ColumnDef<AppTableFeatures, ProductResponse>[] {
  return [
    {
      accessorKey: 'title',
      header: 'Title',
      enableSorting: true,
      cell: (props) => props.getValue<string>(),
    },
    {
      id: 'category',
      header: 'Category',
      enableSorting: false,
      cell: (props) => {
        const categoryTitle = props.row.original.category?.title;
        return categoryTitle ?? '-';
      },
    },
    {
      accessorKey: 'is_featured',
      header: 'Featured',
      enableSorting: false,
      cell: (props) => {
        const isFeatured = props.getValue<boolean>();

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
      cell: (props) => {
        const isActive = props.getValue<boolean>();

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
      cell: (props) => formatDateTime(props.getValue<string>()),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: () =>
        flexRenderComponent(ProductTableButtons, {
          inputs: {
            onDelete: opts.onDelete,
          },
        }),
    },
  ];
}
