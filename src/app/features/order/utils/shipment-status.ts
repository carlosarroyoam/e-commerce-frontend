import { OrderShipmentResponse } from '@/features/order/data-access/interfaces/order-detail-response';
import { ChipVariants } from '@/shared/components/ui/chip/chip';

export interface ShipmentStatus {
  label: string;
  variant: NonNullable<ChipVariants['variant']>;
}

/**
 * Deriva el estado visual de un envío a partir de sus fechas de envío y entrega, ya que la API
 * no expone un campo de estado explícito para los envíos.
 *
 * @param shipment Envío a evaluar.
 * @returns Etiqueta y variante de `Chip` con las que se representa el estado del envío.
 */
export const getShipmentStatus = (shipment: OrderShipmentResponse): ShipmentStatus => {
  if (shipment.delivered_at) {
    return { label: 'Delivered', variant: 'success' };
  }

  if (shipment.shipped_at) {
    return { label: 'Shipped', variant: 'warning' };
  }

  return { label: 'Not shipped', variant: 'default' };
};
