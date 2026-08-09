import { TestBed } from '@angular/core/testing';
import { describe, it, expect } from 'vitest';

import { OrderTableButtons } from './order-table-buttons';

describe('OrderTableButtons', () => {
  it('should compile', async () => {
    await TestBed.configureTestingModule({
      imports: [OrderTableButtons],
    }).compileComponents();

    expect(true).toBe(true);
  });
});
