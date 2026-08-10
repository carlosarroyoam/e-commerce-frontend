import { createMask } from '../mask-test-utils';
import { CreditCardMask } from './credit-card-mask.directive';

describe('CreditCardMask', () => {
  it('should create an instance', () => {
    const directive = createMask(CreditCardMask);
    expect(directive).toBeTruthy();
  });
});
