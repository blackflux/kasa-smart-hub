const expect = require('chai').expect;
const { describe } = require('node-tdd');
const secondsUntilNextTime = require('../../src/util/seconds-until-next-time');

describe('Testing seconds-until-next-time.js', {
  timestamp: '2021-03-28T21:39:01.897Z'
}, () => {
  it('Testing large timeout when no times provided', () => {
    expect(secondsUntilNextTime([], 'UTC')).to.equal(Number.MAX_SAFE_INTEGER);
  });

  it('Testing almost 24 hours', () => {
    expect(secondsUntilNextTime(['21:39'], 'UTC')).to.equal(86399);
  });

  it('Testing almost immediately', () => {
    expect(secondsUntilNextTime(['21:40'], 'UTC')).to.equal(59);
  });

  it('Testing multiple times', () => {
    expect(secondsUntilNextTime(['21:40', '21:39'], 'UTC')).to.equal(59);
    expect(secondsUntilNextTime(['21:39', '21:40'], 'UTC')).to.equal(59);
  });
});
