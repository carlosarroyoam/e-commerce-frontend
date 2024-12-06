import { DOCUMENT } from '@angular/common';
import {
  AfterViewInit,
  Directive,
  ElementRef,
  Inject,
  OnDestroy,
  output,
} from '@angular/core';
import { filter, fromEvent, Subscription } from 'rxjs';

@Directive({
  selector: '[clickOutside]',
  standalone: true,
})
export class ClickOutsideDirective implements AfterViewInit, OnDestroy {
  clickOutside = output<void>();
  documentClickSubscription: Subscription | undefined;

  constructor(
    private readonly _elementRef: ElementRef,
    @Inject(DOCUMENT) private readonly document: Document,
  ) {}

  ngAfterViewInit(): void {
    this.documentClickSubscription = fromEvent(this.document, 'click')
      .pipe(filter((event) => !this.isClickInside(event.target as HTMLElement)))
      .subscribe(() => this.clickOutside.emit());
  }

  ngOnDestroy(): void {
    this.documentClickSubscription?.unsubscribe();
  }

  isClickInside(element: HTMLElement): boolean {
    return (
      element === this._elementRef.nativeElement ||
      this._elementRef.nativeElement.contains(element)
    );
  }
}
