import { CreditCardMask } from './credit-card-mask.directive';
import { createMask } from '../mask-test-utils';

describe('CreditCardMask', () => {
  it('should create an instance', () => {
    const directive = createMask(CreditCardMask);
    expect(directive).toBeTruthy();
  });
});
