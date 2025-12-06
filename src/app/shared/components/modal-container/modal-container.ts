import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-modal-container',
  templateUrl: './modal-container.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalContainer {}
