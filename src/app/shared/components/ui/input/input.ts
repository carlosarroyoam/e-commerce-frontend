import {
  AfterViewInit,
  computed,
  Directive,
  inject,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import {
  AbstractControl,
  NgControl,
  PristineChangeEvent,
  TouchedChangeEvent,
} from '@angular/forms';
import { Subscription } from 'rxjs';
import { twMerge } from 'tailwind-merge';

@Directive({
  selector: 'input[appInput]',
  host: {
    '[class]': 'hostClass()',
  },
})
export class AppInput implements OnInit, AfterViewInit, OnDestroy {
  private readonly ngControl = inject(NgControl);
  private control?: AbstractControl | null;
  private changesSubscription = new Subscription();

  private invalid = signal(false);

  ngOnInit(): void {
    this.control = this.ngControl?.control;
  }

  ngAfterViewInit(): void {
    if (!this.control) return;

    this.changesSubscription.add(
      this.control.valueChanges.subscribe(() => this.checkIfInvalid()),
    );

    this.changesSubscription.add(
      this.control.events.subscribe((event) => {
        if (
          event instanceof TouchedChangeEvent ||
          event instanceof PristineChangeEvent
        ) {
          this.checkIfInvalid();
        }
      }),
    );
  }

  ngOnDestroy(): void {
    this.changesSubscription.unsubscribe();
  }

  protected checkIfInvalid(): void {
    if (!this.control) return;

    this.invalid.set(
      this.control.invalid && (this.control.touched || this.control.dirty),
    );
  }

  protected hostClass = computed(() => {
    const invalid = this.invalid() && 'border-red-500';

    return twMerge(
      'w-full rounded-md border-zinc-200 text-sm text-zinc-900 shadow-xs',
      invalid,
    );
  });
}
