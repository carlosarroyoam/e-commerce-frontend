import { TextMask } from './text-mask.directive';
import { createMask } from '../mask-test-utils';

describe('TextMask', () => {
  it('should create an instance', () => {
    const directive = createMask(TextMask);
    expect(directive).toBeTruthy();
  });
});
