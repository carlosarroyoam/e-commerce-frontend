import { ChangeDetectionStrategy, Component } from '@angular/core';

import { injectFormMode } from '@/core/routing/form-mode';

/**
 * Página de creación, edición y consulta de categorías. Placeholder: pendiente de implementar.
 */
@Component({
  selector: 'app-category-form',
  templateUrl: './category-form-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryFormPage {
  /**
   * Modo de la página (`new`, `edit` o `view`), declarado en `data` de la ruta.
   */
  protected readonly mode = injectFormMode();
}
