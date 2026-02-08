import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';

import { AlertDialog } from './alert-dialog';

describe('AlertDialog', () => {
  let component: AlertDialog;
  let fixture: ComponentFixture<AlertDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlertDialog],
      providers: [
        {
          provide: DialogRef,
          useValue: {
            close: vi.fn(),
          },
        },
        {
          provide: DIALOG_DATA,
          useValue: {
            title: 'Test',
            message: 'Hello world',
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AlertDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
