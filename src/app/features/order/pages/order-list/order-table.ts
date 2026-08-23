import { ColumnDef, flexRenderComponent } from '@tanstack/angular-table';

import { formatDateTime } from '@/core/utils/date.utils';
import { formatCurrency } from '@/core/utils/number.utils';
import { OrderTableButtons } from '@/features/order/components/order-table-buttons/order-table-buttons';
import { OrderResponse, OrderStatus } from '@/features/order/data-access/interfaces/order-response';
import { Chip, ChipVariants } from '@/shared/components/ui/chip/chip';

const ORDER_STATUS_CONFIG: Record<
  OrderStatus,
  { label: string; variant: NonNullable<ChipVariants['variant']> }
> = {
  PENDING: { label: 'Pending', variant: 'warning' },
  CONFIRMED: { label: 'Confirmed', variant: 'warning' },
  PROCESSING: { label: 'Processing', variant: 'warning' },
  SHIPPED: { label: 'Shipped', variant: 'success' },
  DELIVERED: { label: 'Delivered', variant: 'success' },
  CANCELLED: { label: 'Cancelled', variant: 'danger' },
  REFUNDED: { label: 'Refunded', variant: 'danger' },
};

/**
 * Construye las columnas de la tabla de órdenes: número de orden, cliente, total, estado, fecha
 * de creación y acciones.
 *
 * @param opts Callbacks de la tabla.
 * @returns Definición de columnas para TanStack Table.
 */
export function buildOrderTableColumns(opts: {
  onCancel: (order: OrderResponse) => void;
}): ColumnDef<OrderResponse>[] {
  return [
    {
      accessorKey: 'order_number',
      header: 'Order number',
      enableSorting: true,
      cell: (info) => info.getValue(),
    },
    {
      id: 'customer',
      header: 'Customer',
      enableSorting: false,
      cell: (info) => {
        const customer = info.row.original.customer;
        return customer ? `${customer.first_name} ${customer.last_name}` : '—';
      },
    },
    {
      accessorKey: 'total',
      header: 'Total',
      enableSorting: true,
      cell: (info) => formatCurrency(info.getValue() as number),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      enableSorting: false,
      cell: (info) => {
        const status = info.getValue() as OrderStatus;
        const { label, variant } = ORDER_STATUS_CONFIG[status];

        return flexRenderComponent(Chip, {
          inputs: {
            variant,
            label,
          },
        });
      },
    },
    {
      accessorKey: 'created_at',
      header: 'Created at',
      enableSorting: false,
      cell: (info) => formatDateTime(info.getValue() as string),
    },
    {
      id: 'actions',
      header: 'Actions',
      enableSorting: false,
      cell: () =>
        flexRenderComponent(OrderTableButtons, {
          inputs: {
            onCancel: opts.onCancel,
          },
        }),
    },
  ];
}
