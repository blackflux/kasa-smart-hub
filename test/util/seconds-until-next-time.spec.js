import { expect } from 'chai';
import { describe } from 'node-tdd';
import secondsUntilNextTime from '../../src/util/seconds-until-next-time.js';

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

  it('Testing week days', () => {
    expect(secondsUntilNextTime(['Mo 21:39'], 'UTC')).to.equal(86399);
    expect(secondsUntilNextTime(['Tu 21:39'], 'UTC')).to.equal(172799);
    expect(secondsUntilNextTime(['We 21:39'], 'UTC')).to.equal(259199);
    expect(secondsUntilNextTime(['Th 21:39'], 'UTC')).to.equal(345599);
    expect(secondsUntilNextTime(['Fr 21:39'], 'UTC')).to.equal(431999);
    expect(secondsUntilNextTime(['Sa 21:39'], 'UTC')).to.equal(518399);
    expect(secondsUntilNextTime(['Su 21:39'], 'UTC')).to.equal(604799);

    expect(secondsUntilNextTime(['Mo 21:40'], 'UTC')).to.equal(86459);
    expect(secondsUntilNextTime(['Tu 21:40'], 'UTC')).to.equal(172859);
    expect(secondsUntilNextTime(['We 21:40'], 'UTC')).to.equal(259259);
    expect(secondsUntilNextTime(['Th 21:40'], 'UTC')).to.equal(345659);
    expect(secondsUntilNextTime(['Fr 21:40'], 'UTC')).to.equal(432059);
    expect(secondsUntilNextTime(['Sa 21:40'], 'UTC')).to.equal(518459);
    expect(secondsUntilNextTime(['Su 21:40'], 'UTC')).to.equal(59);
  });
});
