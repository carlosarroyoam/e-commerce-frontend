import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserTableButtons } from './user-table-buttons';

describe('UserTableButtons', () => {
  let component: UserTableButtons;
  let fixture: ComponentFixture<UserTableButtons>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserTableButtons],
    }).compileComponents();

    fixture = TestBed.createComponent(UserTableButtons);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
