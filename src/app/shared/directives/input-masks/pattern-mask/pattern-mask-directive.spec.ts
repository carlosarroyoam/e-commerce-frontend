import { PatternMask } from './pattern-mask-directive';
import { createMask } from '../mask-test-utils';

describe('PatternMask', () => {
  it('should create an instance', () => {
    const directive = createMask(PatternMask);
    expect(directive).toBeTruthy();
  });
});
