import { Directive, inject, input, TemplateRef } from '@angular/core';

@Directive({
  selector: 'ng-template[appStepPanel]',
})
export class StepPanel {
  public readonly templateRef = inject(TemplateRef<unknown>);
  public readonly index = input.required<number>({ alias: 'appStepPanel' });
}
