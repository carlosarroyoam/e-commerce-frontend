import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

/**
 * Página de creación y edición de productos. Placeholder: pendiente de implementar.
 */
@Component({
  selector: 'app-product-form',
  templateUrl: './product-form-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductFormPage {
  private readonly route = inject(ActivatedRoute);

  protected readonly isEditMode = this.route.snapshot.paramMap.has('id');
}
