import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Chip } from './chip';

describe('ChipComponent', () => {
  let component: Chip;
  let fixture: ComponentFixture<Chip>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Chip],
    }).compileComponents();

    fixture = TestBed.createComponent(Chip);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
