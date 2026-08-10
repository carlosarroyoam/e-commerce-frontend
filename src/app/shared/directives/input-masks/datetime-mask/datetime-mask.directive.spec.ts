import { createMask } from '../mask-test-utils';
import { DateTimeMask } from './datetime-mask.directive';

describe('DateTimeMask', () => {
  it('should create an instance', () => {
    const directive = createMask(DateTimeMask);
    expect(directive).toBeTruthy();
  });
});
