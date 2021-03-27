const expect = require('chai').expect;
const { describe } = require('node-tdd');
const onlyOnce = require('../../src/util/only-once');

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
