import { computed, Directive, input } from '@angular/core';
import { cva, VariantProps } from 'class-variance-authority';
import { twMerge } from 'tailwind-merge';

export const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-semibold focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:cursor-not-allowed disabled:opacity-90',
  {
    variants: {
      variant: {
        default:
          'bg-zinc-900 text-white shadow-xs hover:bg-zinc-900/90 focus:ring-zinc-800',
        secondary:
          'bg-zinc-100 text-zinc-900 hover:bg-zinc-100/90 focus:ring-zinc-100',
        danger:
          'bg-red-500 text-white shadow-xs hover:bg-red-500/90 focus:ring-red-500',
        outline:
          'border border-zinc-300 text-zinc-900 hover:bg-zinc-50 focus:ring-zinc-100',
        link: 'cursor-pointer whitespace-nowrap text-zinc-700 underline-offset-8 hover:text-zinc-900 hover:underline focus:ring-zinc-800',
      },
      size: {
        default: 'h-10 px-5 py-2',
        icon: 'size-8',
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
  selector: 'button[appButton],a[appButton]',
  host: {
    '[class]': 'hostClass()',
  },
})
export class Button {
  public variant = input<ButtonVariants['variant']>();
  public size = input<ButtonVariants['size']>();

  protected hostClass = computed(() => {
    return twMerge(
      buttonVariants({ variant: this.variant(), size: this.size() }),
    );
  });
}
