import { describe, expect, it } from 'vitest';

import { formatDateTime } from '@/core/utils/date.utils';
import { DateTimePipe } from './date-time.pipe';

describe('DateTimePipe', () => {
  const pipe = new DateTimePipe();
  const value = '2026-01-01T10:00:00Z';

  it('should format with the default options', () => {
    expect(pipe.transform(value)).toBe(formatDateTime(value));
  });

  it('should forward custom options', () => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric' };

    expect(pipe.transform(value, options)).toBe(formatDateTime(value, options));
  });

  it('should return null for null or undefined', () => {
    expect(pipe.transform(null)).toBeNull();
    expect(pipe.transform(undefined)).toBeNull();
  });
});
