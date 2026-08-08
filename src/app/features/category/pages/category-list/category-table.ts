import { ColumnDef, flexRenderComponent } from '@tanstack/angular-table';

import { CategoryTableButtons } from '@/features/category/components/category-table-buttons/category-table-buttons';
import { CategoryResponse } from '@/features/category/data-access/interfaces/category-response';
import { Chip } from '@/shared/components/ui/chip/chip';

export function buildCategoryTableColumns(opts: {
  onDelete: (category: CategoryResponse) => void;
}): ColumnDef<CategoryResponse>[] {
  return [
    {
      accessorKey: 'title',
      header: 'Title',
      enableSorting: true,
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: 'deleted_at',
      header: 'Status',
      enableSorting: false,
      cell: (info) =>
        flexRenderComponent(Chip, {
          inputs: {
            variant: info.getValue() ? 'danger' : 'success',
            label: info.getValue() ? 'Deleted' : 'Active',
          },
        }),
    },
    {
      id: 'actions',
      header: 'Actions',
      enableSorting: false,
      cell: () =>
        flexRenderComponent(CategoryTableButtons, {
          inputs: {
            onDelete: opts.onDelete,
          },
        }),
    },
  ];
}
