import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';

import { OrderTableButtons } from './order-table-buttons';

describe('OrderTableButtons', () => {
  it('should compile', async () => {
    await TestBed.configureTestingModule({
      imports: [OrderTableButtons],
    }).compileComponents();

    expect(true).toBe(true);
  });
});
