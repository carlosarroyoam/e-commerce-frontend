import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';

import { CustomerTableButtons } from './customer-table-buttons';

describe('CustomerTableButtons', () => {
  it('should compile', async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerTableButtons],
    }).compileComponents();

    expect(true).toBe(true);
  });
});
