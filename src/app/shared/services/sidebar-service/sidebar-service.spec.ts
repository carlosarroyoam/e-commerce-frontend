import { TestBed } from '@angular/core/testing';

import { SidebarService } from './sidebar-service';

describe('SidebarService', () => {
  let service: SidebarService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SidebarService);
  });

  it('is closed initially', () => {
    expect(service.isSidebarOpen()).toBe(false);
  });

  it('toggles the mobile sidebar', () => {
    service.toggle();
    expect(service.isSidebarOpen()).toBe(true);

    service.toggle();
    expect(service.isSidebarOpen()).toBe(false);
  });

  it('closes the mobile sidebar', () => {
    service.toggle();
    service.close();

    expect(service.isSidebarOpen()).toBe(false);
  });
});
