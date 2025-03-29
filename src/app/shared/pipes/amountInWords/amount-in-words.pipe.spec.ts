import { AmountInWordsPipe } from './amount-in-words.pipe';

describe('AmountInWordsPipe', () => {
  it('create an instance', () => {
    const pipe = new AmountInWordsPipe();
    expect(pipe).toBeTruthy();
  });
});
