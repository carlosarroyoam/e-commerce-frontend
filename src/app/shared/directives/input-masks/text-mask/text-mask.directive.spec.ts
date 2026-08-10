import { createMask } from '../mask-test-utils';
import { TextMask } from './text-mask.directive';

describe('TextMask', () => {
  it('should create an instance', () => {
    const directive = createMask(TextMask);
    expect(directive).toBeTruthy();
  });
});
