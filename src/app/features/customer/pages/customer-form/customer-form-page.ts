import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

/**
 * Página de creación/edición de clientes. Placeholder: pendiente de implementar.
 */
@Component({
  selector: 'app-customer-form',
  templateUrl: './customer-form-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomerFormPage {
  private readonly route = inject(ActivatedRoute);

  protected readonly isEditMode = this.route.snapshot.paramMap.has('id');
}
