import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * Contenedor base para diálogos modales, provee la estructura visual compartida.
 */
@Component({
  selector: 'app-modal-container',
  templateUrl: './modal-container.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalContainer {}
