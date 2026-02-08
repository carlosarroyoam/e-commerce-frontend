import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

import { InputError } from './input-error';

@Component({
  template: `<app-input-error [control]="control" />`,
  imports: [ReactiveFormsModule, InputError],
})
class HostComponent {
  control = new FormControl<string | null>(null);
}

describe('InputError', () => {
  let fixture: ComponentFixture<HostComponent>;
  let host: HostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HostComponent);
    host = fixture.componentInstance;
  });

  function text(): string {
    return fixture.nativeElement.textContent;
  }

  it('should not show errors when control is pristine', () => {
    host.control.setValidators(Validators.required);
    host.control.updateValueAndValidity();
    fixture.detectChanges();

    expect(text()).not.toContain('The field is required.');
  });

  it('should show required error when touched and invalid', () => {
    host.control.setValidators(Validators.required);
    host.control.updateValueAndValidity();
    host.control.markAsTouched();
    fixture.detectChanges();

    expect(text()).toContain('The field is required.');
  });
});
