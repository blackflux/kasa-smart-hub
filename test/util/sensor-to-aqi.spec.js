import { expect } from 'chai';
import { describe } from 'node-tdd';
import aqibot from 'aqi-bot';
import sensorToAqi from '../../src/util/sensor-to-aqi.js';

describe('Testing sensor-to-aqi.js', () => {
  it('Testing basic sensor', () => {
    const sensor = {
      'pm2.5': 137.8,
      'pm10.0': 152.1
    };
    expect(sensorToAqi(sensor)).to.equal(193);
  });

  it('Testing high values', () => {
    const sensor = {
      'pm2.5': 637.8,
      'pm10.0': 752.1
    };
    expect(sensorToAqi(sensor)).to.equal(648);
  });

  it('Testing against library (pm2.5)', async () => {
    for (let i = 0; i <= 500; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      const { aqi: lib } = await aqibot.AQICalculator.getAQIResult('PM2.5', i);
      const custom = sensorToAqi({ 'pm2.5': i, 'pm10.0': 0 });
      expect(lib).to.equal(custom);
    }
  });

  it('Testing against library (pm10.0)', async () => {
    for (let i = 0; i <= 604; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      const { aqi: lib } = await aqibot.AQICalculator.getAQIResult('PM10', i);
      const custom = sensorToAqi({ 'pm2.5': 0, 'pm10.0': i });
      expect(lib).to.equal(custom);
    }
  });

  it('Testing low values', () => {
    const sensor = {
      'pm2.5': -100,
      'pm10.0': -100
    };
    expect(sensorToAqi(sensor)).to.equal(0);
  });

  it('Testing undefined values', () => {
    const sensor = {
      'pm2.5': undefined,
      'pm10.0': undefined
    };
    expect(sensorToAqi(sensor)).to.deep.equal(Number.NaN);
  });
});
