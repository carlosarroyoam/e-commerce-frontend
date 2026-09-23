import { HttpErrorResponse } from '@angular/common/http';
import { describe, expect, it } from 'vitest';

import { extractErrorMessage } from './error.utils';

describe('extractErrorMessage', () => {
  const httpError = (error: unknown) => new HttpErrorResponse({ status: 404, error });

  it('should return a string error as is', () => {
    expect(extractErrorMessage('Something failed')).toBe('Something failed');
  });

  it('should prefer the problem detail', () => {
    const error = httpError({ title: 'Not Found', detail: 'User with id 1 not found' });

    expect(extractErrorMessage(error)).toBe('User with id 1 not found');
  });

  it('should fall back to the problem title', () => {
    expect(extractErrorMessage(httpError({ title: 'Not Found' }))).toBe('Not Found');
  });

  it('should fall back to the message field', () => {
    expect(extractErrorMessage(httpError({ message: 'Legacy message' }))).toBe('Legacy message');
  });

  it('should return a generic message when nothing can be extracted', () => {
    expect(extractErrorMessage(httpError(null))).toBe('Unexpected error occurred');
    expect(extractErrorMessage(httpError({ detail: '  ' }))).toBe('Unexpected error occurred');
    expect(extractErrorMessage(undefined)).toBe('Unexpected error occurred');
  });
});
