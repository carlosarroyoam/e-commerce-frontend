import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepPanel } from './step-panel';
import { Stepper, StepperStep } from './stepper';

@Component({
  imports: [Stepper, StepPanel],
  template: `
    <app-stepper
      [activeStep]="activeStep"
      [interactive]="interactive"
      [orientation]="orientation"
      [steps]="steps"
      (stepChange)="handleStepChange($event)"
    >
      <ng-template [appStepPanel]="0">Step 1 Content</ng-template>
      <ng-template [appStepPanel]="1">Step 2 Content</ng-template>
      <ng-template [appStepPanel]="2">Step 3 Content</ng-template>
    </app-stepper>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class HostComponent {
  public activeStep = 1;
  public interactive = true;
  public orientation: 'horizontal' | 'vertical' = 'horizontal';
  public readonly stepChangeEvents: number[] = [];
  public steps: StepperStep[] = [
    { label: 'Cart' },
    { label: 'Shipping', description: 'Choose an address' },
    { label: 'Payment' },
  ];

  public handleStepChange(index: number): void {
    this.stepChangeEvents.push(index);
  }
}

describe('Stepper', () => {
  let fixture: ComponentFixture<HostComponent>;
  let component: HostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should derive visual statuses when status is not provided', () => {
    expect(fixture.nativeElement.textContent).toContain('Cart');
    expect(fixture.nativeElement.textContent).toContain('Shipping');

    const currentStep = fixture.nativeElement.querySelector(
      '[aria-current="step"]',
    ) as HTMLElement | null;

    expect(currentStep?.textContent).toContain('Shipping');
  });

  it('should respect explicit statuses', () => {
    component.steps = [
      { label: 'Cart', status: 'completed' },
      { label: 'Shipping', status: 'error' },
      { label: 'Payment', status: 'upcoming' },
    ];

    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('!');
    expect(fixture.nativeElement.textContent).toContain('Cart');
  });

  it('should render only the active step panel content', () => {
    expect(fixture.nativeElement.textContent).toContain('Step 2 Content');
    expect(fixture.nativeElement.textContent).not.toContain('Step 1 Content');
    expect(fixture.nativeElement.textContent).not.toContain('Step 3 Content');
  });

  it('should emit stepChange when clicking an enabled step', () => {
    const buttons = fixture.nativeElement.querySelectorAll(
      'ol button',
    ) as NodeListOf<HTMLButtonElement>;

    buttons[2].click();
    fixture.detectChanges();

    expect(component.stepChangeEvents).toEqual([2]);
  });

  it('should not emit stepChange when clicking a disabled step', () => {
    component.steps = [
      { label: 'Cart' },
      { label: 'Shipping', disabled: true },
      { label: 'Payment' },
    ];

    fixture.detectChanges();

    const disabledStep = fixture.nativeElement.querySelector(
      '[id$="-step-1"]',
    ) as HTMLElement;

    disabledStep.click();
    fixture.detectChanges();

    expect(component.stepChangeEvents).toEqual([]);
  });

  it('should support vertical orientation', () => {
    component.orientation = 'vertical';

    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Step 2 Content');
  });

  it('should throw when steps and projected panels do not match', async () => {
    @Component({
      imports: [Stepper, StepPanel],
      template: `
        <app-stepper [activeStep]="0" [steps]="steps">
          <ng-template [appStepPanel]="0">Only panel</ng-template>
        </app-stepper>
      `,
    })
    class InvalidHostComponent {
      public readonly steps: StepperStep[] = [
        { label: 'Cart' },
        { label: 'Shipping' },
      ];
    }

    await TestBed.configureTestingModule({
      imports: [InvalidHostComponent],
    }).compileComponents();

    expect(() => {
      const invalidFixture = TestBed.createComponent(InvalidHostComponent);
      invalidFixture.detectChanges();
    }).toThrowError('Stepper requires exactly 2 step panels, but received 1.');
  });
});
