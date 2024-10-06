import { ClickOutsideDirective } from '@/app/shared/directives/click-outside.directive';
import { ElementRef } from '@angular/core';

describe('ClickOutsideDirective', () => {
  it('should create an instance', () => {
    const directive = new ClickOutsideDirective();
    expect(directive).toBeTruthy();
  });
});
