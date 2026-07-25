import { CurrencyMask } from './currency-mask.directive';
import { createMask } from '../mask-test-utils';

describe('CurrencyMask', () => {
  it('should create an instance', () => {
    const directive = createMask(CurrencyMask);
    expect(directive).toBeTruthy();
  });
});
