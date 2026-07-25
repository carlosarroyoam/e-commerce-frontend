import { DateTimeMask } from './datetime-mask.directive';
import { createMask } from '../mask-test-utils';

describe('DateTimeMask', () => {
  it('should create an instance', () => {
    const directive = createMask(DateTimeMask);
    expect(directive).toBeTruthy();
  });
});
