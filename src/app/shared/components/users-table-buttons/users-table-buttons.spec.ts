import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersTableButtons } from './users-table-buttons';

describe('UsersTableButtonsComponent', () => {
  let component: UsersTableButtons;
  let fixture: ComponentFixture<UsersTableButtons>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsersTableButtons],
    }).compileComponents();

    fixture = TestBed.createComponent(UsersTableButtons);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
