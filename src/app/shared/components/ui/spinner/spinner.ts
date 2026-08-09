import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { cva, VariantProps } from 'class-variance-authority';
import { twMerge } from 'tailwind-merge';

export const spinnerVariants = cva('inline-block animate-spin', {
  variants: {
    size: {
      sm: 'size-3',
      default: 'size-4',
      lg: 'size-6',
      xl: 'size-8',
    },
  },
  defaultVariants: {
    size: 'default',
  },
});

export type SpinnerVariants = VariantProps<typeof spinnerVariants>;

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.html',
  host: {
    '[class]': 'hostClass()',
    role: 'status',
    'aria-label': 'Loading',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Spinner {
  public readonly size = input<SpinnerVariants['size']>();

  protected readonly hostClass = computed(() => {
    return twMerge(spinnerVariants({ size: this.size() }));
  });
}
