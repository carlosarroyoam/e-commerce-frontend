import { Directive, inject, input, TemplateRef } from '@angular/core';

/**
 * Marca un `ng-template` como el panel de contenido de un paso dentro de `Stepper`, identificado por su índice.
 */
@Directive({
  selector: 'ng-template[appStepPanel]',
})
export class StepPanel {
  public readonly templateRef = inject(TemplateRef<unknown>);
  public readonly index = input.required<number>({ alias: 'appStepPanel' });
}
