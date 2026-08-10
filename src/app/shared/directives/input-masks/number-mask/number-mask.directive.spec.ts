import { createMask } from '../mask-test-utils';
import { NumberMask } from './number-mask.directive';

describe('NumberMask', () => {
  it('should create an instance', () => {
    const directive = createMask(NumberMask);
    expect(directive).toBeTruthy();
  });
});
