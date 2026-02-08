import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Button } from './button';

@Component({
  imports: [Button],
  template: `
    <button appButton [variant]="variant" [size]="size" data-testid="btn">
      Click
    </button>
  `,
})
class HostComponent {
  variant?: 'default' | 'secondary' | 'danger' | 'outline' | 'link';
  size?: 'default' | 'icon';
}

describe('Button', () => {
  let fixture: ComponentFixture<HostComponent>;
  let host: HostComponent;
  let button: HTMLButtonElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HostComponent);
    host = fixture.componentInstance;
    host.variant = 'danger';

    fixture.detectChanges();

    button = fixture.nativeElement.querySelector(
      '[data-testid="btn"]',
    ) as HTMLButtonElement;
  });

  it('should apply base button classes', () => {
    expect(button.className).toContain('inline-flex');
    expect(button.className).toContain('rounded-md');
  });

  it('should apply variant classes', () => {
    expect(button.className).toContain('bg-red-500');
    expect(button.className).toContain('text-white');
  });
});
