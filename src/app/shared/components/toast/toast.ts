import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { LucideX } from '@lucide/angular';
import { cva, VariantProps } from 'class-variance-authority';
import { twMerge } from 'tailwind-merge';

import { ToastData } from '@/shared/components/toast/interfaces/toast.interfaces';

export const toastVariants = cva(
  'relative block rounded-md border border-zinc-100 bg-white px-4 py-2.5 pr-10 shadow-sm md:w-96',
  {
    variants: {
      variant: {
        success: 'border-l-green-500',
        error: 'border-l-red-500',
        warning: 'border-l-amber-500',
        info: 'border-l-blue-500',
      },
    },
    defaultVariants: {
      variant: 'info',
    },
  },
);

export type ToastVariants = VariantProps<typeof toastVariants>;

@Component({
  selector: 'app-toast',
  imports: [LucideX],
  templateUrl: './toast.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClass()',
    '(mouseenter)': 'pauseTimer()',
    '(mouseleave)': 'resumeTimer()',
  },
})
export class Toast implements OnDestroy, OnInit {
  public readonly data = input.required<ToastData>();

  private timer?: number;
  private remaining = 0;
  private start = 0;

  protected readonly hostClass = computed(() => {
    return twMerge(toastVariants({ variant: this.data().type }));
  });

  ngOnInit() {
    const duration = this.data().duration;

    if (duration > 0) {
      this.startTimer(duration);
    }
  }

  ngOnDestroy() {
    clearTimeout(this.timer);
  }

  protected close(): void {
    this.data().ref.close();
  }

  private startTimer(duration: number) {
    this.remaining = duration;
    this.start = Date.now();

    this.timer = window.setTimeout(() => {
      this.data().ref.close();
    }, duration);
  }

  protected pauseTimer() {
    clearTimeout(this.timer);
    const elapsed = Date.now() - this.start;
    this.remaining -= elapsed;
  }

  protected resumeTimer() {
    if (this.remaining <= 0) {
      return;
    }

    this.start = Date.now();

    this.timer = window.setTimeout(() => {
      this.data().ref.close();
    }, this.remaining);
  }
}
