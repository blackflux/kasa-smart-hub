const fs = require('smart-fs');
const path = require('path');
const expect = require('chai').expect;
const { describe } = require('node-tdd');
const wait = require('./helper/wait');
const Hub = require('../src/index');
const Mocker = require('./helper/mocker');

describe('Testing Package', {
  useTmpDir: true,
  record: console,
  timestamp: '2021-03-28T21:39:01.897Z'
}, () => {
  before(async () => {
    await Mocker.start();
  });

  after(async () => {
    await Mocker.stop();
  });

  let execute;
  beforeEach(async ({ fixture, dir, recorder }) => {
    execute = async (expected, cb, cfg = {}) => {
      const logFile = path.join(dir, 'kasa-logs.txt');
      const hub = Hub({
        ...fixture('config'),
        logFile,
        ...cfg
      });
      hub.start();
      await wait(50);
      await cb(...hub.client.devices.values());
      await wait(50);
      hub.stop();
      expect(recorder.get()).to.deep.equal(expected);
      expect(fs.smartRead(logFile)).to.deep.equal(expected);
    };
    await Mocker.spawn({
      model: 'hs200',
      data: { alias: 'Mock HS200-A', mac: '50:c7:bf:46:b4:24', deviceId: 'A200-A' }
    });
    await Mocker.spawn({
      model: 'hs200',
      data: { alias: 'Mock HS200-B', mac: '8b:fd:e9:90:32:01', deviceId: 'A200-B' }
    });
  });

  afterEach(async () => {
    await Mocker.clear();
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
      '[2021-03-28T21:39:01.897Z] [DEBUG]: State Changed: Mock HS200-A @ on',
      '[2021-03-28T21:39:01.897Z]: Timer Triggered: Mock HS200-A @ 12:00:00'
    ],
    (d1) => d1.setPowerState(true)
  ));

  it('Testing Device Switched On, default timer of zero', () => execute(
    ['[2021-03-28T21:39:01.897Z] [DEBUG]: State Changed: Mock HS200-A @ on'],
    (d1) => d1.setPowerState(true),
    { timer: { __default: 0 } }
  ));

  it('Testing Linked Devices', () => execute(
    [
      '[2021-03-28T21:39:01.897Z] [DEBUG]: State Changed: Mock HS200-A @ on',
      '[2021-03-28T21:39:01.897Z]: Link Triggered: Mock HS200-A -> Mock HS200-B @ on',
      '[2021-03-28T21:39:01.897Z] [DEBUG]: State Changed: Mock HS200-B @ on',
      '[2021-03-28T21:39:01.897Z]: Timer Triggered: Mock HS200-A @ 12:00:00',
      '[2021-03-28T21:39:01.897Z]: Timer Triggered: Mock HS200-B @ 12:00:00'
    ],
    (d1) => d1.setPowerState(true),
    {
      links: {
        'switch-link': ['Mock HS200-A', 'Mock HS200-B']
      }
    }
  ));
});
