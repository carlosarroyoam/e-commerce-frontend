import { formatDate } from '@angular/common';
import { ColumnDef, flexRenderComponent } from '@tanstack/angular-table';

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

const CURRENCY_FORMATTER = new Intl.NumberFormat('es-MX', {
  style: 'currency',
  currency: 'MXN',
});

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
      cell: (info) => CURRENCY_FORMATTER.format(info.getValue() as number),
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
      cell: (info) => formatDate(info.getValue() as string, 'dd/MM/yyyy hh:mm a', 'es-MX'),
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
