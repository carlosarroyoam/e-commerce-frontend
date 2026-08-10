import { createMask } from '../mask-test-utils';
import { PercentMask } from './percent-mask.directive';

describe('PercentMask', () => {
  it('should create an instance', () => {
    const directive = createMask(PercentMask);
    expect(directive).toBeTruthy();
  });
});
