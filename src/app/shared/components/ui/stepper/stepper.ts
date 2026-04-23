import { NgTemplateOutlet } from '@angular/common';
import {
  AfterContentChecked,
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChildren,
  input,
  isDevMode,
  output,
} from '@angular/core';
import { cva } from 'class-variance-authority';
import { twMerge } from 'tailwind-merge';

import { StepPanel } from './step-panel';

export type StepperOrientation = 'horizontal' | 'vertical';
export type StepperStepStatus = 'upcoming' | 'current' | 'completed' | 'error';

export interface StepperStep {
  label: string;
  description?: string;
  status?: StepperStepStatus;
  disabled?: boolean;
}

interface ResolvedStepperStep extends StepperStep {
  readonly resolvedStatus: StepperStepStatus;
}

let nextStepperId = 0;

const stepperContainerVariants = cva('flex gap-6', {
  variants: {
    orientation: {
      horizontal: 'flex-col',
      vertical: 'flex-col lg:flex-row',
    },
  },
  defaultVariants: {
    orientation: 'horizontal',
  },
});

const stepperHeaderVariants = cva('flex', {
  variants: {
    orientation: {
      horizontal:
        'flex-col gap-4 md:flex-row md:items-start md:justify-between md:gap-3',
      vertical: 'w-full flex-col gap-4 lg:max-w-sm',
    },
  },
  defaultVariants: {
    orientation: 'horizontal',
  },
});

const stepperPanelVariants = cva(
  'rounded-xl border border-zinc-200 bg-white p-5 shadow-xs',
  {
    variants: {
      orientation: {
        horizontal: 'w-full',
        vertical: 'w-full flex-1',
      },
    },
    defaultVariants: {
      orientation: 'horizontal',
    },
  },
);

@Component({
  selector: 'app-stepper',
  imports: [NgTemplateOutlet],
  templateUrl: './stepper.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Stepper implements AfterContentChecked {
  private readonly panels = contentChildren(StepPanel);

  public readonly steps = input.required<StepperStep[]>();
  public readonly activeStep = input.required<number>();
  public readonly orientation = input<StepperOrientation>('horizontal');
  public readonly interactive = input<boolean>(true);
  public readonly stepChange = output<number>();

  protected readonly instanceId = `stepper-${nextStepperId++}`;

  protected readonly resolvedSteps = computed<ResolvedStepperStep[]>(() => {
    const activeStep = this.activeStep();

    return this.steps().map((step, index) => ({
      ...step,
      resolvedStatus: step.status ?? this.resolveStepStatus(index, activeStep),
    }));
  });

  protected readonly activePanel = computed(() => {
    const activeStep = this.activeStep();
    return this.panels().find((panel) => panel.index() === activeStep) ?? null;
  });

  protected readonly containerClass = computed(() => {
    return twMerge(
      stepperContainerVariants({ orientation: this.orientation() }),
    );
  });

  protected readonly headerClass = computed(() => {
    return twMerge(stepperHeaderVariants({ orientation: this.orientation() }));
  });

  protected readonly panelClass = computed(() => {
    return twMerge(stepperPanelVariants({ orientation: this.orientation() }));
  });

  public ngAfterContentChecked(): void {
    if (!isDevMode()) {
      return;
    }

    const steps = this.steps();
    const panels = this.panels();
    const panelIndexes = panels.map((panel) => panel.index());
    const uniqueIndexes = new Set(panelIndexes);

    if (steps.length !== panels.length) {
      throw new Error(
        `Stepper requires exactly ${steps.length} step panels, but received ${panels.length}.`,
      );
    }

    if (uniqueIndexes.size !== panelIndexes.length) {
      throw new Error('Stepper step panels must use unique indexes.');
    }

    const missingPanelIndex = steps.findIndex(
      (_, index) => !uniqueIndexes.has(index),
    );

    if (missingPanelIndex >= 0) {
      throw new Error(
        `Stepper is missing a panel for step index ${missingPanelIndex}.`,
      );
    }
  }

  protected handleStepClick(step: ResolvedStepperStep, index: number): void {
    if (!this.interactive() || step.disabled) {
      return;
    }

    this.stepChange.emit(index);
  }

  protected isStepInteractive(step: ResolvedStepperStep): boolean {
    return this.interactive() && !step.disabled;
  }

  protected indicatorClass(step: ResolvedStepperStep): string {
    const shared =
      'flex size-9 shrink-0 items-center justify-center rounded-full border text-sm font-semibold transition-colors';

    const variants: Record<StepperStepStatus, string> = {
      upcoming: 'border-zinc-300 bg-white text-zinc-500',
      current: 'border-blue-600 bg-blue-600 text-white',
      completed: 'border-blue-100 bg-blue-50 text-blue-700',
      error: 'border-red-200 bg-red-50 text-red-700',
    };

    return twMerge(shared, variants[step.resolvedStatus]);
  }

  protected connectorClass(step: ResolvedStepperStep): string {
    const shared = 'hidden rounded-full md:block';
    const statusClass =
      step.resolvedStatus === 'completed' ? 'bg-blue-200' : 'bg-zinc-200';

    if (this.orientation() === 'vertical') {
      return twMerge(shared, 'ml-4 h-10 w-px self-start');
    }

    return twMerge(shared, statusClass, 'mt-4 h-px flex-1');
  }

  protected panelId(index: number): string {
    return `${this.instanceId}-panel-${index}`;
  }

  protected stepLabelId(index: number): string {
    return `${this.instanceId}-step-${index}`;
  }

  protected trackByIndex(index: number): number {
    return index;
  }

  private resolveStepStatus(
    index: number,
    activeStep: number,
  ): StepperStepStatus {
    if (index < activeStep) {
      return 'completed';
    }

    if (index === activeStep) {
      return 'current';
    }

    return 'upcoming';
  }
}
