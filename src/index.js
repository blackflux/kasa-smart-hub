const Joi = require('joi-strict');
const configSchema = require('./resources/config-schema');
const computeLinks = require('./util/compute-links');

module.exports = (config) => {
  Joi.assert(config, configSchema);

  const links = computeLinks(config);
  console.log(links);

  return {
    start: () => {}
  };
};
