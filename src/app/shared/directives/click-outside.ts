import {
  AfterViewInit,
  Directive,
  ElementRef,
  inject,
  OnDestroy,
  output,
  Renderer2,
} from '@angular/core';

@Directive({
  selector: '[appClickOutside]',
})
export class ClickOutside implements AfterViewInit, OnDestroy {
  private readonly elementRef = inject(ElementRef);
  private readonly renderer = inject(Renderer2);

  public clickOutside = output<void>();
  private listener?: (() => void) | null;

  ngAfterViewInit(): void {
    this.listener = this.renderer.listen(
      'document',
      'click',
      (event: Event) => {
        if (this.isClickOutside(event.target as HTMLElement)) {
          this.clickOutside.emit();
        }
      },
    );
  }

  ngOnDestroy(): void {
    this.listener?.();
  }

  private isClickOutside(element: HTMLElement): boolean {
    return (
      element !== this.elementRef.nativeElement &&
      !this.elementRef.nativeElement.contains(element)
    );
  }
}
