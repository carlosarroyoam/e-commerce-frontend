import { computed, Directive, input } from '@angular/core';
import { cva, VariantProps } from 'class-variance-authority';
import { twMerge } from 'tailwind-merge';

export const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-90',
  {
    variants: {
      variant: {
        default:
          'bg-zinc-900 text-white shadow-sm hover:bg-zinc-900/90 focus:ring-zinc-800',
        secondary:
          'bg-zinc-300 text-zinc-900 hover:bg-zinc-300/90 focus:ring-zinc-300',
        danger:
          'bg-red-600 text-white shadow-sm hover:bg-red-600/90 focus:ring-red-500',
        outline:
          'border border-zinc-300 text-zinc-900 hover:bg-zinc-100 focus:ring-zinc-200',
        link: 'cursor-pointer whitespace-nowrap text-zinc-700 underline-offset-8 hover:text-zinc-900 hover:underline focus:ring-zinc-800',
      },
      size: {
        default: 'h-10 px-4 py-2',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export type ButtonVariants = VariantProps<typeof buttonVariants>;

@Directive({
  standalone: true,
  selector: 'button[appButton],a[appButton]',
  host: {
    '[class]': 'computedClass()',
  },
})
export class ButtonDirective {
  variant = input<ButtonVariants['variant']>();
  size = input<ButtonVariants['size']>();

  computedClass = computed(() => {
    return twMerge(
      buttonVariants({ variant: this.variant(), size: this.size() }),
    );
  });
}
