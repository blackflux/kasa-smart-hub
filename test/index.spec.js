const fs = require('smart-fs');
const path = require('path');
const expect = require('chai').expect;
const { describe } = require('node-tdd');
const { Device, UdpServer } = require('tplink-smarthome-simulator');
const wait = require('./helper/wait');
const Hub = require('../src/index');

describe('Testing Package', {
  useTmpDir: true,
  record: console,
  timestamp: '2021-03-28T21:39:01.897Z'
}, () => {
  let device;
  before(async () => {
    device = new Device({
      model: 'hs200',
      data: { alias: 'Mock HS200', mac: '50:c7:bf:46:b4:24', deviceId: 'A200' }
    });
    await UdpServer.start();
    await device.start();
  });

  after(async () => {
    await device.stop();
    UdpServer.stop();
  });

  let execute;
  beforeEach(({ fixture, dir, recorder }) => {
    execute = async (expected, cb, cfg = {}) => {
      const logFile = path.join(dir, 'kasa-logs.txt');
      const hub = Hub({
        ...fixture('config'),
        logFile,
        ...cfg
      });
      hub.start();
      await wait(50);
      const devices = [...hub.client.devices.values()];
      expect(devices.map(({ alias }) => alias)).to.deep.equal(['Mock HS200']);
      await cb(...devices);
      await wait(50);
      hub.stop();
      expect(recorder.get()).to.deep.equal(expected);
      expect(fs.smartRead(logFile)).to.deep.equal(expected);
    };
  });

  it('Testing Init', ({ fixture }) => {
    const hub = Hub(fixture('config'));
    expect(Object.fromEntries(Object.entries(hub).map(([k, v]) => [k, typeof v]))).to.deep.equal({
      client: 'object',
      start: 'function',
      stop: 'function'
    });
  });

  it('Testing Device Switched On', () => execute(
    [
      '[2021-03-28T21:39:01.897Z] [DEBUG]: State Changed: Mock HS200 @ on',
      '[2021-03-28T21:39:01.897Z]: Timer Triggered: Mock HS200 @ 12:00:00'
    ],
    (d1) => d1.setPowerState(true)
  ));
});
