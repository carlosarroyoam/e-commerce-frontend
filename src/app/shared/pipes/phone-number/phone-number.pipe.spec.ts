import { describe, expect, it } from 'vitest';

import { formatPhoneNumber } from '@/core/utils/phone.utils';
import { AppPhoneNumberPipe } from './phone-number.pipe';

describe('AppPhoneNumberPipe', () => {
  const pipe = new AppPhoneNumberPipe();

  it('should format a 10-digit phone number', () => {
    expect(pipe.transform('6181234567')).toBe(formatPhoneNumber('6181234567'));
    expect(pipe.transform('6181234567')).toBe('618 123 4567');
  });

  it('should return the original value when it does not have 10 digits', () => {
    expect(pipe.transform('123')).toBe('123');
  });

  it('should return null for null or undefined', () => {
    expect(pipe.transform(null)).toBeNull();
    expect(pipe.transform(undefined)).toBeNull();
  });
});
