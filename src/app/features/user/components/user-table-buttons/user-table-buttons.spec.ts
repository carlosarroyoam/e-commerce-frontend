import { TestBed } from '@angular/core/testing';
import { describe, it, expect } from 'vitest';

import { UserTableButtons } from './user-table-buttons';

describe('UserTableButtons', () => {
  it('should compile', async () => {
    await TestBed.configureTestingModule({
      imports: [UserTableButtons],
    }).compileComponents();

    expect(true).toBe(true);
  });
});
