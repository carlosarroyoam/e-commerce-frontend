import { createMask } from '../mask-test-utils';
import { CurrencyMask } from './currency-mask.directive';

describe('CurrencyMask', () => {
  it('should create an instance', () => {
    const directive = createMask(CurrencyMask);
    expect(directive).toBeTruthy();
  });
});
