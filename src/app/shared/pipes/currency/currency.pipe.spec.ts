import { describe, expect, it } from 'vitest';

import { formatCurrency } from '@/core/utils/number.utils';
import { CurrencyPipe } from './currency.pipe';

describe('CurrencyPipe', () => {
  const pipe = new CurrencyPipe();

  it('should format with the default currency', () => {
    expect(pipe.transform(1234.5)).toBe(formatCurrency(1234.5));
  });

  it('should forward a custom currency', () => {
    expect(pipe.transform(1234.5, 'USD')).toBe(formatCurrency(1234.5, 'USD'));
  });
});
