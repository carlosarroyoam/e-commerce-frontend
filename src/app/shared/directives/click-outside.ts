import {
  AfterViewInit,
  Directive,
  DOCUMENT,
  ElementRef,
  inject,
  OnDestroy,
  output,
} from '@angular/core';
import { filter, fromEvent, Subscription } from 'rxjs';

@Directive({
  selector: '[appClickOutside]',
  standalone: true,
})
export class ClickOutside implements AfterViewInit, OnDestroy {
  private readonly _elementRef = inject(ElementRef);
  private readonly document = inject(DOCUMENT);

  public clickOutside = output<void>();
  private documentClickSubscription?: Subscription;

  ngAfterViewInit(): void {
    this.documentClickSubscription = fromEvent(this.document, 'click')
      .pipe(filter((event) => !this.isClickInside(event.target as HTMLElement)))
      .subscribe(() => this.clickOutside.emit());
  }

  ngOnDestroy(): void {
    this.documentClickSubscription?.unsubscribe();
  }

  protected isClickInside(element: HTMLElement): boolean {
    return (
      element === this._elementRef.nativeElement ||
      this._elementRef.nativeElement.contains(element)
    );
  }
}
