import { PercentMask } from './percent-mask.directive';
import { createMask } from '../mask-test-utils';

describe('PercentMask', () => {
  it('should create an instance', () => {
    const directive = createMask(PercentMask);
    expect(directive).toBeTruthy();
  });
});
