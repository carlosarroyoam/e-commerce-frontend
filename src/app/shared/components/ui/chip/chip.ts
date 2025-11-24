import { Component, computed, input } from '@angular/core';
import { cva, VariantProps } from 'class-variance-authority';
import { twMerge } from 'tailwind-merge';

export const chipVariants = cva(
  'rounded-md bg-zinc-200 px-2.5 py-1 text-xs font-semibold',
  {
    variants: {
      variant: {
        default: 'bg-blue-50 text-blue-600',
        success: 'bg-green-50 text-green-600',
        danger: 'bg-red-50 text-red-600',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

const chipBadgeVariants = cva('mr-1.5 inline-flex size-2 rounded-full', {
  variants: {
    variant: {
      default: 'bg-blue-600',
      success: 'bg-green-600',
      danger: 'bg-red-600',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

export type ChipVariants = VariantProps<typeof chipVariants>;

@Component({
  selector: 'app-chip',
  templateUrl: './chip.html',
  host: {
    '[class]': 'hostClass()',
  },
})
export class Chip {
  public variant = input<ChipVariants['variant']>();
  public label = input.required<string>();

  protected chipBadgeClass = computed(() => {
    return twMerge(chipBadgeVariants({ variant: this.variant() }));
  });

  protected hostClass = computed(() => {
    return twMerge(chipVariants({ variant: this.variant() }));
  });
}
