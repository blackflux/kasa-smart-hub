import { expect } from 'chai';
import { describe } from 'node-tdd';
import computeDelay from '../../src/util/compute-delay.js';

describe('Testing compute-delay.js', {
  timestamp: '2021-03-28T21:39:01.897Z'
}, () => {
  it('Testing "Timer" Beats "Off Time"', () => {
    expect(computeDelay('TV', true, {
      timer: {
        TV: 83
      },
      off: {
        TV: ['22:00']
      },
      timezone: 'UTC'
    })).to.equal(83);
  });

  it('Testing "Off Time" Beats "Timer"', () => {
    expect(computeDelay('TV', true, {
      timer: {
        TV: 3600
      },
      off: {
        TV: ['22:00']
      },
      timezone: 'UTC'
    })).to.equal(1259);
  });

  it('Testing "On Time" not Present', () => {
    expect(computeDelay('TV', false, {
      on: {},
      timezone: 'UTC'
    })).to.equal(0);
  });
});
