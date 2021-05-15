const Joi = require('joi-strict');
const { Client } = require('tplink-smarthome-api');
const configSchema = require('../resources/config-schema');
const computeLinks = require('../util/compute-links');
const secondsToHumansReadable = require('../util/seconds-to-human-readable');
const secondsUntilNextTime = require('../util/seconds-until-next-time');
const onlyOnce = require('../util/only-once');
const ForEach = require('../util/for-each');
const Log = require('../util/log');

module.exports = (config_) => {
  const config = {
    discoveryConfig: {},
    ...config_
  };
  Joi.assert(config, configSchema);

  const links = computeLinks(config);
  const log = Log(config);
  const client = new Client();
  const forEach = ForEach(client);

  const updateDeviceTimer = async (device, state) => onlyOnce(`update-timer: ${device.alias}`, async () => {
    const delay = (() => {
      if (state === true) {
        // eslint-disable-next-line no-underscore-dangle
        return device.alias in config.timer ? config.timer[device.alias] : config.timer.__default;
      }
      return device.alias in config.on ? secondsUntilNextTime(config.on[device.alias], config.timezone) : 0;
    })();
    if (delay === 0) {
      return;
    }
    const rules = await device.timer.getRules();
    if (rules.err_code !== 0) {
      return;
    }
    if (rules.rule_list.some((r) => r.enable === (state === true ? 1 : 0) && r.remain <= delay)) {
      return;
    }
    const newState = await device.getPowerState();
    if (newState === state) {
      log(`Timer Started: ${device.alias} - ${state ? 'OFF' : 'ON'} in ${secondsToHumansReadable(delay)}`);
      await device.timer.addRule({ delay, powerState: !state });
    }
  });

  const onDevicePowerStateChange = async (device, state) => {
    log('debug', `State Changed: ${device.alias} @ ${state ? 'on' : 'off'}`);
    if (device.alias in links) {
      const group = links[device.alias];
      await onlyOnce(
        `power-toggle: ${[device.alias, ...group].sort().join(' || ')}`,
        async () => {
          log(`Link Triggered: ${device.alias} -> ${[...group].join(', ')} @ ${state ? 'on' : 'off'}`);
          await forEach(
            (d) => d.status === 'online' && group.has(d.alias),
            (d) => d.setPowerState(state)
          );
        }
      );
    }
  };

  const onDeviceSync = async (device, state) => {
    await updateDeviceTimer(device, state);
  };

  client.on('device-new', (device) => {
    device.addListener('power-on', () => onDevicePowerStateChange(device, true));
    device.addListener('power-off', () => onDevicePowerStateChange(device, false));
    device.addListener('power-update', async (state) => onDeviceSync(device, state));
    // fast polling for linked devices
    if (device.alias in links) {
      device.startPolling(500);
    }
  });

  return {
    start: () => {
      client.startDiscovery({
        broadcast: '192.168.0.255',
        port: 56888,
        breakoutChildren: true,
        discoveryInterval: 10000,
        discoveryTimeout: 0,
        offlineTolerance: 3,
        ...config.discoveryConfig
      });
    },
    stop: () => {
      [...client.devices.values()].forEach((d) => {
        d.stopPolling();
      });
      client.stopDiscovery();
    },
    getDevices: () => [...client.devices.values()]
  };
};
