const expect = require('chai').expect;
const { describe } = require('node-tdd');
const computeLinks = require('../../src/util/compute-links');

describe('Testing compute-links.js', () => {
  it('Testing Simple', () => {
    expect(computeLinks({ links: { 'x': ['a', 'b', 'c'] } })).to.deep.equal({
      a: new Set(['b', 'c']),
      b: new Set(['a', 'c']),
      c: new Set(['a', 'b'])
    });
  });

  it('Testing Overlap', () => {
    expect(computeLinks({
      links: {
        'x': ['a', 'b', 'c'],
        'y': ['c', 'd', 'e']
      }
    })).to.deep.equal({
      a: new Set(['b', 'c']),
      b: new Set(['a', 'c']),
      c: new Set(['a', 'b', 'd', 'e']),
      d: new Set(['c', 'e']),
      e: new Set(['c', 'd'])
    });
  });
});
