import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  ReactiveFormsModule,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

import { InputLabel } from './input-label';

@Component({
  imports: [ReactiveFormsModule, InputLabel],
  template: `
    <form [formGroup]="form">
      <label appInputLabel [for]="'name'">Nombre</label>
    </form>
  `,
})
class TestComponent {
  form = new FormGroup({
    name: new FormControl('', { validators: Validators.required }),
  });
}

describe('InputLabel', () => {
  let fixture: ComponentFixture<TestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();
  });

  it('should append a red asterisk when control is required', () => {
    const label: HTMLLabelElement =
      fixture.nativeElement.querySelector('label');

    expect(label.innerHTML).toContain('<span class="text-red-500">*</span>');
  });

  it('should apply host css classes', () => {
    const label: HTMLLabelElement =
      fixture.nativeElement.querySelector('label');

    expect(label.className).toContain('text-sm');
    expect(label.className).toContain('font-medium');
  });
});
