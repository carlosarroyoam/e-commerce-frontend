import { ChangeDetectionStrategy, Component } from '@angular/core';

import { injectFormMode } from '@/core/routing/form-mode';

/**
 * Página de creación, edición y consulta de clientes. Placeholder: pendiente de implementar.
 */
@Component({
  selector: 'app-customer-form',
  templateUrl: './customer-form-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomerFormPage {
  /**
   * Modo de la página (`new`, `edit` o `view`), declarado en `data` de la ruta.
   */
  protected readonly mode = injectFormMode();
}
