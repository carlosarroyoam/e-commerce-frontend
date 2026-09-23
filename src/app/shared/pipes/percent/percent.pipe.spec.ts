import { describe, expect, it } from 'vitest';

import { formatPercent } from '@/core/utils/number.utils';
import { AppPercentPipe } from './percent.pipe';

describe('AppPercentPipe', () => {
  const pipe = new AppPercentPipe();

  it('should format with the default options', () => {
    expect(pipe.transform(0.1234)).toBe(formatPercent(0.1234));
  });

  it('should forward custom options', () => {
    const options: Intl.NumberFormatOptions = { maximumFractionDigits: 0 };

    expect(pipe.transform(0.1234, options)).toBe(formatPercent(0.1234, options));
  });

  it('should return null for null or undefined', () => {
    expect(pipe.transform(null)).toBeNull();
    expect(pipe.transform(undefined)).toBeNull();
  });
});
