import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalContainer } from './modal-container';

describe('Modal', () => {
  let component: ModalContainer;
  let fixture: ComponentFixture<ModalContainer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalContainer],
    }).compileComponents();

    fixture = TestBed.createComponent(ModalContainer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
