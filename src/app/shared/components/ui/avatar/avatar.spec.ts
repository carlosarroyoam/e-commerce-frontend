import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';

import { Avatar } from './avatar';

describe('Avatar', () => {
  it('should compile', async () => {
    await TestBed.configureTestingModule({
      imports: [Avatar],
    }).compileComponents();

    expect(true).toBe(true);
  });
});
