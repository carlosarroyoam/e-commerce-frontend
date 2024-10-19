import { computed, Directive, input } from '@angular/core';
import { cva, VariantProps } from 'class-variance-authority';
import { twMerge } from 'tailwind-merge';

export const badgeVariants = cva(
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

export type BadgeVariants = VariantProps<typeof badgeVariants>;

@Directive({
  standalone: true,
  selector: '[appBadge]',
  host: {
    '[class]': 'computedClass()',
  },
})
export class BadgeDirective {
  variant = input<BadgeVariants['variant']>();

  computedClass = computed(() => {
    return twMerge(badgeVariants({ variant: this.variant() }));
  });
}
