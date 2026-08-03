import { ElementRef, Type } from '@angular/core';
import { TestBed } from '@angular/core/testing';

export function createMask<T>(type: Type<T>): T {
  TestBed.configureTestingModule({
    providers: [{ provide: ElementRef, useValue: new ElementRef(document.createElement('input')) }],
  });

  return TestBed.runInInjectionContext(() => new type());
}
