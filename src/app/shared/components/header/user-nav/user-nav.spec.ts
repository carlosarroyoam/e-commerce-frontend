import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserNav } from './user-nav';

describe('UserNav', () => {
  let component: UserNav;
  let fixture: ComponentFixture<UserNav>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserNav],
    }).compileComponents();

    fixture = TestBed.createComponent(UserNav);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('sessionData', null);
    fixture.componentRef.setInput('menuItems', [
      { href: '/home', title: 'Home' },
    ]);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
