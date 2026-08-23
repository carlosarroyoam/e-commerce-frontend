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

  /** Inicia el temporizador de cierre automático si el toast tiene duración. */
  ngOnInit() {
    const duration = this.data().duration;

    if (duration > 0) {
      this.startTimer(duration);
    }
  }

  /** Limpia el temporizador de cierre automático al destruir el componente. */
  ngOnDestroy() {
    clearTimeout(this.timer);
  }

  /** Cierra el toast. */
  protected close(): void {
    this.data().ref.close();
  }

  /**
   * Programa el cierre automático del toast tras la duración indicada.
   *
   * @param duration Tiempo en milisegundos antes de cerrar el toast automáticamente.
   */
  private startTimer(duration: number) {
    this.remaining = duration;
    this.start = Date.now();

    this.timer = window.setTimeout(() => {
      this.data().ref.close();
    }, duration);
  }

  /** Pausa el temporizador de cierre automático y guarda el tiempo restante. */
  protected pauseTimer() {
    clearTimeout(this.timer);
    const elapsed = Date.now() - this.start;
    this.remaining -= elapsed;
  }

  /** Reanuda el temporizador de cierre automático con el tiempo restante. */
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
