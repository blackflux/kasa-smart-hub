import { expect } from 'chai';
import { describe } from 'node-tdd';
import secondsToHumanReadable from '../../src/util/seconds-to-human-readable.js';

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
