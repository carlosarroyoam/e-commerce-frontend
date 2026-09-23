import { Location } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { LucideArrowLeft, LucidePencil } from '@lucide/angular';

import { CustomerStore } from '@/features/customer/data-access/stores/customer.store';
import { CUSTOMER_STATUS_CONFIG } from '@/features/customer/utils/customer-status';
import { Button } from '@/shared/components/ui/button/button';
import { Chip } from '@/shared/components/ui/chip/chip';
import { Spinner } from '@/shared/components/ui/spinner/spinner';
import { DateTimePipe } from '@/shared/pipes/date-time/date-time.pipe';
import { AppPhoneNumberPipe } from '@/shared/pipes/phone-number/phone-number.pipe';

/**
 * Página de consulta de un cliente. Carga el cliente indicado en la ruta y muestra sus datos.
 */
@Component({
  selector: 'app-customer-detail',
  imports: [
    RouterLink,
    LucideArrowLeft,
    LucidePencil,
    Button,
    Spinner,
    Chip,
    DateTimePipe,
    AppPhoneNumberPipe,
  ],
  templateUrl: './customer-detail-page.html',
  providers: [CustomerStore],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomerDetailPage {
  private readonly route = inject(ActivatedRoute);
  private readonly location = inject(Location);
  protected readonly store = inject(CustomerStore);

  protected readonly customer = this.store.selectedItem;

  protected readonly status = computed(() => {
    const customer = this.customer();
    return customer ? CUSTOMER_STATUS_CONFIG[customer.status] : null;
  });

  /**
   * Carga el cliente indicado en la ruta. Si el id no es un entero positivo no se consulta la API
   * y la página muestra el estado de error.
   */
  constructor() {
    const customerId = Number(this.route.snapshot.paramMap.get('id'));

    if (Number.isInteger(customerId) && customerId > 0) {
      this.store.findById(customerId);
    }
  }

  /**
   * Vuelve a la página anterior del historial (p. ej. el listado con sus filtros).
   */
  protected back(): void {
    this.location.back();
  }
}
