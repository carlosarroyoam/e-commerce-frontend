import {
  AfterViewInit,
  computed,
  DestroyRef,
  Directive,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  AbstractControl,
  NgControl,
  PristineChangeEvent,
  TouchedChangeEvent,
} from '@angular/forms';
import { filter } from 'rxjs';
import { twMerge } from 'tailwind-merge';

@Directive({
  selector: 'input[appInput]',
  host: {
    '[class]': 'hostClass()',
  },
})
export class AppInput implements OnInit, AfterViewInit {
  private readonly ngControl = inject(NgControl);
  private readonly destroyRef = inject(DestroyRef);
  private control?: AbstractControl | null;

  private invalid = signal(false);

  ngOnInit(): void {
    this.control = this.ngControl?.control;
  }

  ngAfterViewInit(): void {
    if (!this.control) {
      throw new Error('No control provided');
    }

    this.control.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.checkIfInvalid());

    this.control.events
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        filter(
          (event) =>
            event instanceof TouchedChangeEvent ||
            event instanceof PristineChangeEvent,
        ),
      )
      .subscribe(() => this.checkIfInvalid());
  }

  protected checkIfInvalid(): void {
    if (!this.control) {
      throw new Error('No control provided');
    }

    this.invalid.set(
      this.control.invalid && (this.control.touched || this.control.dirty),
    );
  }

  protected hostClass = computed(() => {
    const invalid = this.invalid() && 'border-red-500 focus:border-red-500';

    return twMerge(
      'w-full rounded-md border border-zinc-200 text-sm text-zinc-700 placeholder:text-zinc-600 focus:border-blue-500 focus:ring-0 focus:outline-none disabled:cursor-not-allowed disabled:border-zinc-100 disabled:bg-zinc-50 disabled:text-zinc-500 disabled:placeholder:text-zinc-500',
      invalid,
    );
  });
}
