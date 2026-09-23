import { describe, expect, it } from 'vitest';

import { formatCurrency } from '@/core/utils/number.utils';
import { AppCurrencyPipe } from './currency.pipe';

describe('AppCurrencyPipe', () => {
  const pipe = new AppCurrencyPipe();

  it('should format with the default currency', () => {
    expect(pipe.transform(1234.5)).toBe(formatCurrency(1234.5));
  });

  it('should forward a custom currency', () => {
    expect(pipe.transform(1234.5, 'USD')).toBe(formatCurrency(1234.5, 'USD'));
  });

  it('should return null for null or undefined', () => {
    expect(pipe.transform(null)).toBeNull();
    expect(pipe.transform(undefined)).toBeNull();
  });
});
