import {
  AfterViewInit,
  Directive,
  ElementRef,
  inject,
  OnDestroy,
  output,
  Renderer2,
} from '@angular/core';

/**
 * Emite `clickOutside` cuando ocurre un mousedown fuera del elemento host.
 */
@Directive({
  selector: '[appClickOutside]',
})
export class ClickOutside implements AfterViewInit, OnDestroy {
  private readonly elementRef = inject(ElementRef);
  private readonly renderer = inject(Renderer2);

  public readonly clickOutside = output<void>();
  private listener?: () => void;

  /**
   * Registra el listener de mousedown en el documento.
   */
  ngAfterViewInit(): void {
    this.listener = this.renderer.listen('document', 'mousedown', (event: MouseEvent) => {
      const path = event.composedPath?.() ?? [];
      if (!path.includes(this.elementRef.nativeElement)) {
        this.clickOutside.emit();
      }
    });
  }

  /**
   * Remueve el listener registrado en `ngAfterViewInit`.
   */
  ngOnDestroy(): void {
    this.listener?.();
  }
}
