import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { cva, VariantProps } from 'class-variance-authority';
import { twMerge } from 'tailwind-merge';

export const chipVariants = cva('rounded-md bg-zinc-200 px-2.5 py-1 text-xs font-semibold', {
  variants: {
    variant: {
      default: 'bg-blue-50 text-blue-500',
      success: 'bg-green-50 text-green-500',
      warning: 'bg-orange-50 text-orange-500',
      danger: 'bg-red-50 text-red-500',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

const chipBadgeVariants = cva('mr-1.5 inline-flex size-2 rounded-full', {
  variants: {
    variant: {
      default: 'bg-blue-500',
      success: 'bg-green-500',
      warning: 'bg-orange-500',
      danger: 'bg-red-500',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

export type ChipVariants = VariantProps<typeof chipVariants>;

/**
 * Etiqueta visual compacta con variantes de color para indicar estado.
 */
@Component({
  selector: 'app-chip',
  templateUrl: './chip.html',
  host: {
    '[class]': 'hostClass()',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Chip {
  public readonly variant = input<ChipVariants['variant']>();
  public readonly label = input.required<string>();

  protected readonly chipBadgeClass = computed(() => {
    return twMerge(chipBadgeVariants({ variant: this.variant() }));
  });

  protected readonly hostClass = computed(() => {
    return twMerge('inline-flex items-center', chipVariants({ variant: this.variant() }));
  });
}
