import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * Pie de página con información institucional, se muestra en el layout de autenticación.
 */
@Component({
  selector: 'app-footer',
  templateUrl: './footer.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Footer {}
