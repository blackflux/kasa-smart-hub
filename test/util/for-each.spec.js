import { expect } from 'chai';
import { describe } from 'node-tdd';
import ForEach from '../../src/util/for-each.js';

describe('Testing for-each.js', () => {
  let forEach;
  beforeEach(() => {
    forEach = ForEach({ devices: { values: () => [1, 2, 3] } });
  });

  it('Testing basic logic', async () => {
    const result = [];
    forEach((e) => e !== 2, (e) => result.push(e + 10));
    expect(result).to.deep.equal([11, 13]);
  });

  it('Testing empty devices', async () => {
    const result = [];
    forEach(() => false, null);
    expect(result).to.deep.equal([]);
  });
});
