import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';

import { ClickOutside } from './click-outside';

@Component({
  imports: [ClickOutside],
  template: `
    <div appClickOutside (clickOutside)="onOutside()" data-testid="target">
      Inside
    </div>

    <div data-testid="outside">Outside</div>
  `,
})
class HostComponent {
  outsideClicks = 0;

  onOutside() {
    this.outsideClicks++;
  }
}

describe('ClickOutside', () => {
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

  it('should emit when clicking outside', () => {
    const outside = fixture.nativeElement.querySelector(
      '[data-testid="outside"]',
    ) as HTMLElement;

    outside.click();

    expect(host.outsideClicks).toBe(1);
  });

  it('should NOT emit when clicking inside', () => {
    const inside = fixture.nativeElement.querySelector(
      '[data-testid="target"]',
    ) as HTMLElement;

    inside.click();

    expect(host.outsideClicks).toBe(0);
  });

  it('should remove listener on destroy', () => {
    fixture.destroy();

    document.body.click();

    expect(host.outsideClicks).toBe(0);
  });
});
