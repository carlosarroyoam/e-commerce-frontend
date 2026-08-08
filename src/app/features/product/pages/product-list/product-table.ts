import { formatDate } from '@angular/common';
import { ColumnDef, flexRenderComponent } from '@tanstack/angular-table';

import { ProductTableButtons } from '@/features/product/components/product-table-buttons/product-table-buttons';
import { ProductResponse } from '@/features/product/data-access/interfaces/product-response';
import { Chip } from '@/shared/components/ui/chip/chip';

export function buildProductTableColumns(opts: {
  onDelete: (product: ProductResponse) => void;
}): ColumnDef<ProductResponse>[] {
  return [
    {
      accessorKey: 'title',
      header: 'Title',
      enableSorting: true,
      cell: (info) => info.getValue(),
    },
    {
      id: 'category',
      header: 'Category',
      enableSorting: false,
      cell: (info) => info.row.original.category?.title ?? '—',
    },
    {
      accessorKey: 'is_featured',
      header: 'Featured',
      enableSorting: false,
      cell: (info) =>
        flexRenderComponent(Chip, {
          inputs: {
            variant: info.getValue() ? 'success' : 'default',
            label: info.getValue() ? 'Featured' : 'Not featured',
          },
        }),
    },
    {
      accessorKey: 'is_active',
      header: 'Status',
      enableSorting: false,
      cell: (info) =>
        flexRenderComponent(Chip, {
          inputs: {
            variant: info.getValue() ? 'success' : 'danger',
            label: info.getValue() ? 'Active' : 'Inactive',
          },
        }),
    },
    {
      accessorKey: 'created_at',
      header: 'Created at',
      enableSorting: false,
      cell: (info) => formatDate(info.getValue() as string, 'dd/MM/yyyy hh:mm a', 'es-MX'),
    },
    {
      id: 'actions',
      header: 'Actions',
      enableSorting: false,
      cell: () =>
        flexRenderComponent(ProductTableButtons, {
          inputs: {
            onDelete: opts.onDelete,
          },
        }),
    },
  ];
}
