import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { By } from '@angular/platform-browser';

import { AppInput } from './input';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, AppInput],
  template: ` <input appInput [formControl]="control" /> `,
})
class HostComponent {
  control = new FormControl('', Validators.required);
}

describe('Input', () => {
  let fixture: ComponentFixture<HostComponent>;
  let host: HostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
  });

  function inputEl(): HTMLInputElement {
    return fixture.debugElement.query(By.css('input')).nativeElement;
  }

  it('should create', () => {
    expect(inputEl()).toBeTruthy();
  });

  it('should NOT apply invalid classes initially', () => {
    expect(inputEl().className).not.toContain('border-red-500');
  });

  it('should apply invalid classes when touched and invalid', () => {
    host.control.markAsTouched();
    host.control.updateValueAndValidity();
    fixture.detectChanges();

    expect(inputEl().className).toContain('border-red-500');
  });

  it('should remove invalid classes when valid', () => {
    host.control.markAsTouched();
    host.control.setValue('valid value');
    host.control.updateValueAndValidity();
    fixture.detectChanges();

    expect(inputEl().className).not.toContain('border-red-500');
  });
});
