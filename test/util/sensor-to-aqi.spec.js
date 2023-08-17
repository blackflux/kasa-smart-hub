import { expect } from 'chai';
import { describe } from 'node-tdd';
import sensorToAqi from '../../src/util/sensor-to-aqi.js';

describe('Testing sensor-to-aqi.js', () => {
  it('Testing basic sensor', async ({ fixture }) => {
    const sensor = await fixture('sensor');
    expect(await sensorToAqi(sensor)).to.equal(193);
  });
});
