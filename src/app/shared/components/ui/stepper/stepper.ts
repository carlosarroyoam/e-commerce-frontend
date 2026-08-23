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
      horizontal: 'flex-col gap-4 md:flex-row md:items-start md:justify-between md:gap-3',
      vertical: 'w-full flex-col gap-4 lg:max-w-sm',
    },
  },
  defaultVariants: {
    orientation: 'horizontal',
  },
});

const stepperPanelVariants = cva('rounded-xl border border-zinc-200 bg-white p-5 shadow-xs', {
  variants: {
    orientation: {
      horizontal: 'w-full',
      vertical: 'w-full flex-1',
    },
  },
  defaultVariants: {
    orientation: 'horizontal',
  },
});

/**
 * Componente de navegación por pasos: renderiza el indicador de progreso y el panel de contenido activo.
 */
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
    return twMerge(stepperContainerVariants({ orientation: this.orientation() }));
  });

  protected readonly headerClass = computed(() => {
    return twMerge(stepperHeaderVariants({ orientation: this.orientation() }));
  });

  protected readonly panelClass = computed(() => {
    return twMerge(stepperPanelVariants({ orientation: this.orientation() }));
  });

  /**
   * Valida en modo desarrollo que exista un panel único por cada paso declarado.
   */
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

    const missingPanelIndex = steps.findIndex((_, index) => !uniqueIndexes.has(index));

    if (missingPanelIndex >= 0) {
      throw new Error(`Stepper is missing a panel for step index ${missingPanelIndex}.`);
    }
  }

  /**
   * Emite el cambio de paso activo cuando el stepper es interactivo y el paso no está deshabilitado.
   *
   * @param step Paso resuelto sobre el que se hizo clic.
   * @param index Índice del paso sobre el que se hizo clic.
   */
  protected handleStepClick(step: ResolvedStepperStep, index: number): void {
    if (!this.interactive() || step.disabled) {
      return;
    }

    this.stepChange.emit(index);
  }

  /**
   * Indica si un paso puede recibir interacción del usuario.
   *
   * @param step Paso resuelto a evaluar.
   * @returns true si el stepper es interactivo y el paso no está deshabilitado.
   */
  protected isStepInteractive(step: ResolvedStepperStep): boolean {
    return this.interactive() && !step.disabled;
  }

  /**
   * Calcula las clases del indicador circular según el estado resuelto del paso.
   *
   * @param step Paso resuelto cuyo indicador se calcula.
   * @returns Clases CSS del indicador.
   */
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

  /**
   * Calcula las clases del conector entre pasos según la orientación y el estado.
   *
   * @param step Paso resuelto cuyo conector se calcula.
   * @returns Clases CSS del conector.
   */
  protected connectorClass(step: ResolvedStepperStep): string {
    const shared = 'hidden rounded-full md:block';
    const statusClass = step.resolvedStatus === 'completed' ? 'bg-blue-200' : 'bg-zinc-200';

    if (this.orientation() === 'vertical') {
      return twMerge(shared, 'ml-4 h-10 w-px self-start');
    }

    return twMerge(shared, statusClass, 'mt-4 h-px flex-1');
  }

  /**
   * Genera el id del panel de contenido correspondiente al índice de paso.
   *
   * @param index Índice del paso.
   * @returns Id del panel de contenido.
   */
  protected panelId(index: number): string {
    return `${this.instanceId}-panel-${index}`;
  }

  /**
   * Genera el id de la etiqueta del paso correspondiente al índice.
   *
   * @param index Índice del paso.
   * @returns Id de la etiqueta del paso.
   */
  protected stepLabelId(index: number): string {
    return `${this.instanceId}-step-${index}`;
  }

  /**
   * Función de trackBy que identifica cada paso por su índice.
   *
   * @param index Índice del paso.
   * @returns El mismo índice, usado como identificador.
   */
  protected trackByIndex(index: number): number {
    return index;
  }

  /**
   * Determina el estado de un paso a partir de su índice y el paso activo.
   *
   * @param index Índice del paso a evaluar.
   * @param activeStep Índice del paso actualmente activo.
   * @returns Estado resuelto del paso.
   */
  private resolveStepStatus(index: number, activeStep: number): StepperStepStatus {
    if (index < activeStep) {
      return 'completed';
    }

    if (index === activeStep) {
      return 'current';
    }

    return 'upcoming';
  }
}
