import { createMask } from '../mask-test-utils';
import { PatternMask } from './pattern-mask-directive';

describe('PatternMask', () => {
  it('should create an instance', () => {
    const directive = createMask(PatternMask);
    expect(directive).toBeTruthy();
  });
});
