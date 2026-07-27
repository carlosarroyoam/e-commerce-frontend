import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { SidebarService } from '@/shared/services/sidebar-service/sidebar-service';
import { Header } from './header';

describe('Header', () => {
  let fixture: ComponentFixture<Header>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Header],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(Header);
    await fixture.whenStable();
  });

  it('renders the brand and toggles the sidebar', () => {
    const sidebarService = TestBed.inject(SidebarService);
    const button = fixture.nativeElement.querySelector('button') as HTMLButtonElement;

    button.click();
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('e-commerce');
    expect(sidebarService.isSidebarOpen()).toBe(true);
    expect(button.getAttribute('aria-expanded')).toBe('true');
  });
});
