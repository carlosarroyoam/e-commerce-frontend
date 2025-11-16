import { ElementRef } from '@angular/core';

import { ClickOutsideDirective } from './click-outside.directive';

describe('ClickOutsideDirective', () => {
  it('should create an instance', () => {
    const mockElementRef = new ElementRef(document.createElement('div'));
    const directive = new ClickOutsideDirective(mockElementRef, document);

    expect(directive).toBeTruthy();
    expect(directive).toBeTruthy();
  });
});
