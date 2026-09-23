import { Location } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { LucideArrowLeft, LucidePencil } from '@lucide/angular';

import { OrderStore } from '@/features/order/data-access/stores/order.store';
import { ORDER_STATUS_CONFIG } from '@/features/order/utils/order-status';
import { PAYMENT_METHOD_LABELS } from '@/features/order/utils/payment-method';
import { PAYMENT_STATUS_CONFIG } from '@/features/order/utils/payment-status';
import { getShipmentStatus } from '@/features/order/utils/shipment-status';
import { Button } from '@/shared/components/ui/button/button';
import { Chip } from '@/shared/components/ui/chip/chip';
import { Spinner } from '@/shared/components/ui/spinner/spinner';
import { AppCurrencyPipe } from '@/shared/pipes/currency/currency.pipe';
import { DateTimePipe } from '@/shared/pipes/date-time/date-time.pipe';
import { AppPhoneNumberPipe } from '@/shared/pipes/phone-number/phone-number.pipe';

/**
 * Página de consulta de una orden. Carga la orden indicada en la ruta y muestra sus datos.
 */
@Component({
  selector: 'app-order-detail',
  imports: [
    RouterLink,
    LucideArrowLeft,
    LucidePencil,
    Button,
    Spinner,
    Chip,
    DateTimePipe,
    AppCurrencyPipe,
    AppPhoneNumberPipe,
  ],
  templateUrl: './order-detail-page.html',
  providers: [OrderStore],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderDetailPage {
  private readonly route = inject(ActivatedRoute);
  private readonly location = inject(Location);
  protected readonly store = inject(OrderStore);

  protected readonly order = this.store.selectedItem;

  protected readonly status = computed(() => {
    const order = this.order();
    return order ? ORDER_STATUS_CONFIG[order.status] : null;
  });

  protected readonly paymentMethodLabel = PAYMENT_METHOD_LABELS;
  protected readonly paymentStatusConfig = PAYMENT_STATUS_CONFIG;
  protected readonly getShipmentStatus = getShipmentStatus;

  /**
   * Carga la orden indicada en la ruta. Si el id no es un entero positivo no se consulta la API y
   * la página muestra el estado de error.
   */
  constructor() {
    const orderId = Number(this.route.snapshot.paramMap.get('id'));

    if (Number.isInteger(orderId) && orderId > 0) {
      this.store.findById(orderId);
    }
  }

  /**
   * Vuelve a la página anterior del historial (p. ej. el listado con sus filtros).
   */
  protected back(): void {
    this.location.back();
  }
}
