const expect = require('chai').expect;
const { describe } = require('node-tdd');
const index = require('../src/index');

describe('Testing Index', () => {
  it('Testing Exported', () => {
    expect(index instanceof Object).to.equal(true);
  });
});
