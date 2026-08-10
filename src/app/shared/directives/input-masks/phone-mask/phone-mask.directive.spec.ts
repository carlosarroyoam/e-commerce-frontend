import { createMask } from '../mask-test-utils';
import { PhoneMask } from './phone-mask.directive';

describe('PhoneMask', () => {
  it('should create an instance', () => {
    const directive = createMask(PhoneMask);
    expect(directive).toBeTruthy();
  });
});
