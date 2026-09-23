import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

/**
 * Página de creación y edición de categorías. Placeholder: pendiente de implementar.
 */
@Component({
  selector: 'app-category-form',
  templateUrl: './category-form-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryFormPage {
  private readonly route = inject(ActivatedRoute);

  protected readonly isEditMode = this.route.snapshot.paramMap.has('id');
}
