import { InputError } from './input-error';

describe('Error', () => {
  it('should create an instance', () => {
    const directive = new InputError();
    expect(directive).toBeTruthy();
  });
});
