import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToastStack } from './toast-stack';

describe('ToastStack', () => {
  let component: ToastStack;
  let fixture: ComponentFixture<ToastStack>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToastStack],
    }).compileComponents();

    fixture = TestBed.createComponent(ToastStack);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
