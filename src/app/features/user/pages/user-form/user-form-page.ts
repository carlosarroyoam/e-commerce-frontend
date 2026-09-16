import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

/**
 * Página de creación/edición de usuarios. Placeholder: pendiente de implementar.
 */
@Component({
  selector: 'app-user-form',
  templateUrl: './user-form-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserFormPage {
  private readonly route = inject(ActivatedRoute);

  protected readonly isEditMode = this.route.snapshot.paramMap.has('id');
}
