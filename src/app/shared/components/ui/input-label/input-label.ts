import { Directive, ElementRef, inject, input, OnInit } from '@angular/core';
import { FormGroupDirective, Validators } from '@angular/forms';
import { twMerge } from 'tailwind-merge';

@Directive({
  selector: 'label[appInputLabel]',
  host: {
    '[class]': 'hostClass',
  },
})
export class InputLabel implements OnInit {
  private readonly elementRef = inject(ElementRef);
  private readonly formGroup = inject(FormGroupDirective);

  public for = input.required<string>();

  ngOnInit(): void {
    const control = this.formGroup.form.get(this.for());

    if (control?.hasValidator(Validators.required)) {
      this.elementRef.nativeElement.innerHTML += ` <span class="text-red-500">*</span>`;
    }
  }

  protected hostClass = twMerge(
    'block text-sm leading-6 font-medium text-zinc-900',
  );
}
