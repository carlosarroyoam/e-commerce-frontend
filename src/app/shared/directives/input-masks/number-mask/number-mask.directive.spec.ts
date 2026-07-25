import { NumberMask } from './number-mask.directive';
import { createMask } from '../mask-test-utils';

describe('NumberMask', () => {
  it('should create an instance', () => {
    const directive = createMask(NumberMask);
    expect(directive).toBeTruthy();
  });
});
