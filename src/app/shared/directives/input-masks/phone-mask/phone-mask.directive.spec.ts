import { PhoneMask } from './phone-mask.directive';
import { createMask } from '../mask-test-utils';

describe('PhoneMask', () => {
  it('should create an instance', () => {
    const directive = createMask(PhoneMask);
    expect(directive).toBeTruthy();
  });
});
