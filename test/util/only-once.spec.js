import { expect } from 'chai';
import { describe } from 'node-tdd';
import onlyOnce from '../../src/util/only-once.js';

describe('Testing only-once.js', () => {
  it('Testing executed only once', async () => {
    const result = [];
    const fn = (id) => onlyOnce('id', () => new Promise((resolve) => {
      setTimeout(() => {
        result.push(id);
        resolve();
      }, 10);
    }));
    await Promise.all([fn(1), fn(2)]);
    expect(result).to.deep.equal([1]);
  });
});
