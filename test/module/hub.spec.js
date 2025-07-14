import path from 'path';
import fs from 'smart-fs';
import { expect } from 'chai';
import { describe } from 'node-tdd';
import wait from '../helper/wait.js';
import Hub from '../../src/module/hub.js';
import Mocker from '../helper/mocker.js';
import { ERROR_COLOR } from '../../src/resources/config.js';

describe('Testing Hub', {
  useTmpDir: true,
  record: console,
  timestamp: '2021-03-28T21:39:01.897Z',
  useNock: true
}, () => {
  before(async () => {
    await Mocker.start();
  });

  after(async () => {
    await Mocker.stop();
  });

  let execute;

  beforeEach(async ({ fixture, dir, recorder }) => {
    const config = await fixture('config');
    execute = async (expected, cb, cfg = {}, init = null, delay = 50) => {
      if (init === null) {
        await Mocker.spawn({
          model: 'hs200',
          data: { alias: 'Mock HS200-A', mac: '50:c7:bf:46:b4:24', deviceId: 'A200-A' }
        });
        await Mocker.spawn({
          model: 'hs200',
          data: { alias: 'Mock HS200-B', mac: '8b:fd:e9:90:32:01', deviceId: 'A200-B' }
        });
      } else {
        await init();
      }
      const logFile = path.join(dir, 'kasa-logs.txt');
      const hub = Hub({
        ...config,
        logFile,
        ...cfg
      });
      hub.start();
      await wait(delay);
      await cb(...hub.getDevices());
      await wait(delay);
      hub.stop();
      expect(recorder.get()).to.deep.equal(expected);
      expect(fs.smartRead(logFile)).to.deep.equal(expected);
    };
  });

  afterEach(async () => {
    await Mocker.clear();
  });

  it('Testing Init', async ({ fixture }) => {
    const config = await fixture('config');
    const hub = Hub(config);
    expect(Object.fromEntries(Object.entries(hub).map(([k, v]) => [k, typeof v]))).to.deep.equal({
      start: 'function',
      stop: 'function',
      getDevices: 'function'
    });
  });

  it('Testing Device Switched On', () => execute(
    [
      '[2021-03-28T21:39:01.897Z]: New Device: Mock HS200-A',
      '[2021-03-28T21:39:01.897Z]: New Device: Mock HS200-B',
      '[2021-03-28T21:39:01.897Z] [DEBUG]: State Changed: Mock HS200-A @ on',
      '[2021-03-28T21:39:01.897Z]: Timer Started: Mock HS200-A - OFF in 12:00:00'
    ],
    (d1) => d1.setPowerState(true)
  ));

  it('Testing Device Switched On, and then Off', () => execute(
    [
      '[2021-03-28T21:39:01.897Z]: New Device: Mock HS200-A',
      '[2021-03-28T21:39:01.897Z]: New Device: Mock HS200-B',
      '[2021-03-28T21:39:01.897Z] [DEBUG]: State Changed: Mock HS200-A @ on',
      '[2021-03-28T21:39:01.897Z]: Timer Started: Mock HS200-A - OFF in 12:00:00',
      '[2021-03-28T21:39:01.897Z] [DEBUG]: State Changed: Mock HS200-A @ off'
    ],
    async (d1) => {
      await d1.setPowerState(true);
      await wait(50);
      await d1.setPowerState(false);
    }
  ));

  it('Testing Device Switched On, custom timer', () => execute(
    [
      '[2021-03-28T21:39:01.897Z]: New Device: Mock HS200-A',
      '[2021-03-28T21:39:01.897Z]: New Device: Mock HS200-B',
      '[2021-03-28T21:39:01.897Z] [DEBUG]: State Changed: Mock HS200-A @ on',
      '[2021-03-28T21:39:01.897Z]: Timer Started: Mock HS200-A - OFF in 00:10:00'
    ],
    (d1) => d1.setPowerState(true),
    { timer: { __default: 12 * 60 * 60, 'Mock HS200-A': 10 * 60 } }
  ));

  it('Testing Device Switched Off, custom on time', () => execute(
    [
      '[2021-03-28T21:39:01.897Z]: New Device: Mock HS200-A',
      '[2021-03-28T21:39:01.897Z]: New Device: Mock HS200-B',
      '[2021-03-28T21:39:01.897Z]: Timer Started: Mock HS200-A - ON in 00:20:59'
    ],
    (d1) => d1.setPowerState(false),
    { on: { 'Mock HS200-A': ['22:00'] }, timezone: 'UTC' }
  ));

  it('Testing Device Switched On, default timer of zero', () => execute(
    [
      '[2021-03-28T21:39:01.897Z]: New Device: Mock HS200-A',
      '[2021-03-28T21:39:01.897Z]: New Device: Mock HS200-B',
      '[2021-03-28T21:39:01.897Z] [DEBUG]: State Changed: Mock HS200-A @ on'
    ],
    (d1) => d1.setPowerState(true),
    { timer: { __default: 0 } }
  ));

  it('Testing Linked Devices', () => execute(
    [
      '[2021-03-28T21:39:01.897Z]: New Device: Mock HS200-A',
      '[2021-03-28T21:39:01.897Z]: New Device: Mock HS200-B',
      '[2021-03-28T21:39:01.897Z] [DEBUG]: State Changed: Mock HS200-A @ on',
      '[2021-03-28T21:39:01.897Z]: Link Triggered: Mock HS200-A -> Mock HS200-B @ on',
      '[2021-03-28T21:39:01.897Z] [DEBUG]: State Changed: Mock HS200-B @ on',
      '[2021-03-28T21:39:01.897Z]: Timer Started: Mock HS200-A - OFF in 12:00:00',
      '[2021-03-28T21:39:01.897Z]: Timer Started: Mock HS200-B - OFF in 12:00:00'
    ],
    (d1) => d1.setPowerState(true),
    {
      links: {
        'switch-link': ['Mock HS200-A', 'Mock HS200-B']
      }
    }
  ));

  it('Testing Linked Devices with Error', () => execute(
    [
      '[2021-03-28T21:39:01.897Z]: New Device: Mock HS200-A',
      '[2021-03-28T21:39:01.897Z]: New Device: Mock HS200-B',
      '[2021-03-28T21:39:01.897Z] [DEBUG]: State Changed: Mock HS200-A @ on',
      '[2021-03-28T21:39:01.897Z]: Link Triggered: Mock HS200-A -> Mock HS200-B @ on',
      '[2021-03-28T21:39:01.897Z] [DEBUG]: State Changed: Mock HS200-B @ on',
      '[2021-03-28T21:39:01.897Z]: Timer Started: Mock HS200-A - OFF in 12:00:00',
      '[2021-03-28T21:39:01.897Z]: Timer Started: Mock HS200-B - OFF in 12:00:00',
      '[2021-03-28T21:39:01.897Z]: Timer Started: Mock HS200-B - OFF in 12:00:00'
    ],
    async (d1) => {
      await d1.setPowerState(true);
      const getInfo = d1.getInfo;
      // eslint-disable-next-line no-param-reassign
      d1.getInfo = () => {
        // eslint-disable-next-line no-param-reassign
        d1.getInfo = getInfo;
        throw new Error('Temporary getInfo() error');
      };
    },
    {
      links: {
        'switch-link': ['Mock HS200-A', 'Mock HS200-B']
      }
    },
    null,
    600
  ));

  it('Testing Linked Devices, and Off', () => execute(
    [
      '[2021-03-28T21:39:01.897Z]: New Device: Mock HS200-A',
      '[2021-03-28T21:39:01.897Z]: New Device: Mock HS200-B',
      '[2021-03-28T21:39:01.897Z] [DEBUG]: State Changed: Mock HS200-A @ on',
      '[2021-03-28T21:39:01.897Z]: Link Triggered: Mock HS200-A -> Mock HS200-B @ on',
      '[2021-03-28T21:39:01.897Z] [DEBUG]: State Changed: Mock HS200-B @ on',
      '[2021-03-28T21:39:01.897Z]: Timer Started: Mock HS200-A - OFF in 12:00:00',
      '[2021-03-28T21:39:01.897Z]: Timer Started: Mock HS200-B - OFF in 12:00:00',
      '[2021-03-28T21:39:01.897Z] [DEBUG]: State Changed: Mock HS200-B @ off',
      '[2021-03-28T21:39:01.897Z]: Link Triggered: Mock HS200-B -> Mock HS200-A @ off',
      '[2021-03-28T21:39:01.897Z] [DEBUG]: State Changed: Mock HS200-A @ off'
    ],
    async (d1, d2) => {
      await d1.setPowerState(true);
      await wait(50);
      await d2.setPowerState(false);
    },
    {
      links: {
        'switch-link': ['Mock HS200-A', 'Mock HS200-B']
      }
    }
  ));

  it('Testing Timer Rule, Api Error', () => execute(
    [
      '[2021-03-28T21:39:01.897Z]: New Device: Mock HS200-A',
      '[2021-03-28T21:39:01.897Z]: New Device: Mock HS200-B',
      '[2021-03-28T21:39:01.897Z] [DEBUG]: State Changed: Mock HS200-A @ on'
    ],
    async (d1) => {
      // eslint-disable-next-line no-param-reassign
      d1.timer.getRules = () => ({
        err_code: 1
      });
      await d1.setPowerState(true);
    }
  ));

  it('Testing Timer Rule, Rule already Present (Timer)', () => execute(
    [
      '[2021-03-28T21:39:01.897Z]: New Device: Mock HS200-A',
      '[2021-03-28T21:39:01.897Z]: New Device: Mock HS200-B',
      '[2021-03-28T21:39:01.897Z] [DEBUG]: State Changed: Mock HS200-A @ on'
    ],
    async (d1) => {
      // eslint-disable-next-line no-param-reassign
      d1.timer.getRules = () => ({
        rule_list: [
          {
            id: '59BE5F3518239ACBC9E595F1955AC692',
            enable: 1,
            name: 'timer',
            delay: 600,
            act: 0,
            remain: 599
          }
        ],
        err_code: 0
      });
      await d1.setPowerState(true);
    }
  ));

  it('Testing Timer Rule, Rule already Present (On Time)', () => execute(
    [
      '[2021-03-28T21:39:01.897Z]: New Device: Mock HS200-A',
      '[2021-03-28T21:39:01.897Z]: New Device: Mock HS200-B'
    ],
    async (d1) => {
      // eslint-disable-next-line no-param-reassign
      d1.timer.getRules = () => ({
        rule_list: [
          {
            id: '59BE5F3518239ACBC9E595F1955AC692',
            enable: 1,
            name: 'timer',
            delay: 10,
            act: 0,
            remain: 9
          }
        ],
        err_code: 0
      });
      await d1.setPowerState(false);
    },
    { on: { 'Mock HS200-A': ['21:00'] } }
  ));

  it('Testing Large Delay ignored', () => execute(
    [
      '[2021-03-28T21:39:01.897Z]: New Device: Mock HS200-A',
      '[2021-03-28T21:39:01.897Z]: New Device: Mock HS200-B'
    ],
    async (d1) => {
      await d1.setPowerState(false);
    },
    { on: { 'Mock HS200-A': ['We 21:00'] } }
  ));

  it('Testing Timer Rule, Device already disabled', () => execute(
    [
      '[2021-03-28T21:39:01.897Z]: New Device: Mock HS200-A',
      '[2021-03-28T21:39:01.897Z]: New Device: Mock HS200-B',
      '[2021-03-28T21:39:01.897Z] [DEBUG]: State Changed: Mock HS200-A @ on'
    ],
    async (d1) => {
      // eslint-disable-next-line no-param-reassign
      d1.getPowerState = () => false;
      await d1.setPowerState(true);
    }
  ));

  it('Testing Color Hue Change', async ({ fixture }) => {
    const config = await fixture('config-rgb');
    await execute(
      [
        '[2021-03-28T21:39:01.897Z]: New Device: RGB Strip',
        '[2021-03-28T21:39:01.897Z] [DEBUG]: Color Update: #a0347e'
      ],
      async (d1) => {},
      config,
      async () => {
        await Mocker.spawn({
          model: 'kl430',
          data: { alias: 'RGB Strip', mac: '8b:fd:e9:90:32:01', deviceId: 'KL430-A' }
        });
      }
    );
  });

  it('Testing RGB No Config', async ({ fixture }) => {
    await execute(
      [
        '[2021-03-28T21:39:01.897Z]: New Device: RGB Strip'
      ],
      async (d1) => {},
      {},
      async () => {
        await Mocker.spawn({
          model: 'kl430',
          data: { alias: 'RGB Strip', mac: '8b:fd:e9:90:32:01', deviceId: 'KL430-A' }
        });
      }
    );
  });

  it('Testing Color Hue Change Error', async ({ fixture }) => {
    const config = await fixture('config-rgb');
    await execute(
      [
        '[2021-03-28T21:39:01.897Z]: New Device: RGB Strip',
        `[2021-03-28T21:39:01.897Z] [DEBUG]: Color Update: ${ERROR_COLOR}`
      ],
      async (d1) => {
        await wait(1200);
      },
      config,
      async () => {
        await Mocker.spawn({
          model: 'kl430',
          data: { alias: 'RGB Strip', mac: '8b:fd:e9:90:32:01', deviceId: 'KL430-A' }
        });
      }
    );
  });
});
