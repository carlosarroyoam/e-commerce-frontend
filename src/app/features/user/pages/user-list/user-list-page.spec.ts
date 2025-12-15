import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserListPage } from './user-list-page';

describe('UserListPage', () => {
  let component: UserListPage;
  let fixture: ComponentFixture<UserListPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserListPage],
    }).compileComponents();

    fixture = TestBed.createComponent(UserListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
