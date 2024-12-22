import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersTableButtonsComponent } from './users-table-buttons.component';

describe('UsersTableButtonsComponent', () => {
  let component: UsersTableButtonsComponent;
  let fixture: ComponentFixture<UsersTableButtonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsersTableButtonsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UsersTableButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
