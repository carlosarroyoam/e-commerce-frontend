import { TestBed } from '@angular/core/testing';

import { StorageService } from './storage-service';

class TestStorageService extends StorageService {
  protected readonly storage = localStorage;
  protected readonly namespace = 'test';
}

describe('StorageService', () => {
  let service: StorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.runInInjectionContext(() => new TestStorageService());
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
