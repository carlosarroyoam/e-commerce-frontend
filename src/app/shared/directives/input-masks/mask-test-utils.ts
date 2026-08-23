import { ElementRef, Type } from '@angular/core';
import { TestBed } from '@angular/core/testing';

/**
 * Instancia una directiva de máscara en un contexto de inyección de pruebas, con un
 * `ElementRef` respaldado por un `<input>` recién creado.
 *
 * @param type Clase de la directiva de máscara a instanciar.
 * @returns Instancia de la directiva lista para usar en pruebas.
 */
export function createMask<T>(type: Type<T>): T {
  TestBed.configureTestingModule({
    providers: [{ provide: ElementRef, useValue: new ElementRef(document.createElement('input')) }],
  });

  return TestBed.runInInjectionContext(() => new type());
}
