import { describe, expect, it } from 'vitest';

import { formatPercent } from '@/core/utils/number.utils';
import { PercentPipe } from './percent.pipe';

describe('PercentPipe', () => {
  const pipe = new PercentPipe();

  it('should format with the default options', () => {
    expect(pipe.transform(0.1234)).toBe(formatPercent(0.1234));
  });

  it('should forward custom options', () => {
    const options: Intl.NumberFormatOptions = { maximumFractionDigits: 0 };

    expect(pipe.transform(0.1234, options)).toBe(formatPercent(0.1234, options));
  });
});
