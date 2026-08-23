import { Directive, ElementRef, inject, input, OnInit } from '@angular/core';
import { FormGroupDirective, Validators } from '@angular/forms';
import { twMerge } from 'tailwind-merge';

/**
 * Directiva para etiquetas de formulario. Añade un asterisco visual cuando el control asociado es obligatorio.
 */
@Directive({
  selector: 'label[appInputLabel]',
  host: {
    '[class]': 'hostClass',
  },
})
export class InputLabel implements OnInit {
  private readonly elementRef = inject(ElementRef);
  private readonly formGroup = inject(FormGroupDirective);

  public readonly for = input.required<string>();

  /**
   * Agrega un indicador de campo requerido a la etiqueta si el control tiene el validador `required`.
   */
  ngOnInit(): void {
    const control = this.formGroup.form.get(this.for());

    if (control?.hasValidator(Validators.required)) {
      this.elementRef.nativeElement.innerHTML += ` <span class="text-red-500">*</span>`;
    }
  }

  protected hostClass = twMerge('block text-sm leading-6 font-medium text-zinc-900');
}
