const expect = require('chai').expect;
const { describe } = require('node-tdd');
const Hub = require('../src/index');

describe('Testing Package', () => {
  it('Testing Init', ({ fixture }) => {
    const hub = Hub(fixture('config'));
    expect(Object.fromEntries(Object.entries(hub).map(([k, v]) => [k, typeof v]))).to.deep.equal({
      start: 'function'
    });
  });
});
