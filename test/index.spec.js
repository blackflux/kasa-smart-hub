import { expect } from 'chai';
import { describe } from 'node-tdd';
import index from '../src/index.js';

describe('Testing Index', () => {
  it('Testing Exported', () => {
    expect(index instanceof Object).to.equal(true);
  });
});
