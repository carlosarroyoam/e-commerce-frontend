import { TestBed } from '@angular/core/testing';
import { describe, it, expect } from 'vitest';

import { ProductTableButtons } from './product-table-buttons';

describe('ProductTableButtons', () => {
  it('should compile', async () => {
    await TestBed.configureTestingModule({
      imports: [ProductTableButtons],
    }).compileComponents();

    expect(true).toBe(true);
  });
});
