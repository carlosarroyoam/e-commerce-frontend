import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

/**
 * Página de creación y edición de órdenes. Placeholder: pendiente de implementar.
 */
@Component({
  selector: 'app-order-form',
  templateUrl: './order-form-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderFormPage {
  private readonly route = inject(ActivatedRoute);

  protected readonly isEditMode = this.route.snapshot.paramMap.has('id');
}
