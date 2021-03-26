const Joi = require('joi-strict');
const configSchema = require('./resources/config-schema');

module.exports = (config) => {
  Joi.assert(config, configSchema);

  return {
    start: () => {}
  };
};
