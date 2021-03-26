const Joi = require('joi-strict');
const { Client } = require('tplink-smarthome-api');
const configSchema = require('./resources/config-schema');
const computeLinks = require('./util/compute-links');

module.exports = (config) => {
  Joi.assert(config, configSchema);

  const links = computeLinks(config);
  const client = new Client();

  return {
    start: () => {
      client.startDiscovery({
        broadcast: '192.168.0.255',
        port: 56888,
        breakoutChildren: true,
        discoveryInterval: 10000,
        discoveryTimeout: 0,
        offlineTolerance: 3
      });
    }
  };
};
