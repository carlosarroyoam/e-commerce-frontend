import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';

import { CategoryTableButtons } from './category-table-buttons';

describe('CategoryTableButtons', () => {
  it('should compile', async () => {
    await TestBed.configureTestingModule({
      imports: [CategoryTableButtons],
    }).compileComponents();

    expect(true).toBe(true);
  });
});
