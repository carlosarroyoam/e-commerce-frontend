import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputError } from './input-error';

describe('InputError', () => {
  let component: InputError;
  let fixture: ComponentFixture<InputError>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputError],
    }).compileComponents();

    fixture = TestBed.createComponent(InputError);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
