import { ChangeDetectionStrategy, Component } from '@angular/core';

import { injectFormMode } from '@/core/routing/form-mode';

/**
 * Página de creación, edición y consulta de órdenes. Placeholder: pendiente de implementar.
 */
@Component({
  selector: 'app-order-form',
  templateUrl: './order-form-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderFormPage {
  /**
   * Modo de la página (`new`, `edit` o `view`), declarado en `data` de la ruta.
   */
  protected readonly mode = injectFormMode();
}
