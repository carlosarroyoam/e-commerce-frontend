import { Component, computed, input } from '@angular/core';
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

const iconVariants = cva('mr-1.5 inline-flex size-2 rounded-full', {
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

@Component({
  standalone: true,
  selector: 'app-badge',
  templateUrl: './badge.component.html',
  imports: [],
  host: {
    '[class]': 'computedClass()',
  },
})
export class BadgeComponent {
  variant = input<BadgeVariants['variant']>();
  label = input.required<string>();

  iconClass = computed(() => {
    return twMerge(iconVariants({ variant: this.variant() }));
  });

  computedClass = computed(() => {
    return twMerge(badgeVariants({ variant: this.variant() }));
  });
}
