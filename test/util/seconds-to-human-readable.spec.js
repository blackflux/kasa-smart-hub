const expect = require('chai').expect;
const { describe } = require('node-tdd');
const secondsToHumanReadable = require('../../src/util/seconds-to-human-readable');

describe('Testing seconds-to-human-readable.js', () => {
  it('Testing zero', () => {
    expect(secondsToHumanReadable(0)).to.equal('00:00:00');
  });

  it('Testing basic', () => {
    expect(secondsToHumanReadable(4563)).to.equal('01:16:03');
    expect(secondsToHumanReadable(74563)).to.equal('20:42:43');
  });

  it('Testing large', () => {
    expect(secondsToHumanReadable(451231212363)).to.equal('125342003:26:03');
  });
});
