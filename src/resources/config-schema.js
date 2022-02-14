const Joi = require('joi-strict');
const { time } = require('./regex');

const timerSchema = Joi.number().integer().min(0);
const times = Joi.array().items(Joi.string().regex(time)).unique().min(1);

module.exports = Joi.object().keys({
  discoveryConfig: Joi.object().keys({
    broadcast: Joi.string().ip().optional(),
    // eslint-disable-next-line newline-per-chained-call
    port: Joi.number().integer().min(0).max(65535).optional(),
    breakoutChildren: Joi.boolean().optional(),
    discoveryInterval: Joi.number().integer().min(100).optional(),
    discoveryTimeout: Joi.number().integer().min(0).optional(),
    offlineTolerance: Joi.number().integer().min(0).optional()
  }).unknown(true),
  logFile: Joi.string(),
  links: Joi.object().pattern(
    Joi.string(),
    Joi.array().items(Joi.string()).unique().min(2)
  ),
  timer: Joi.object()
    .keys({ __default: Joi.number().integer().min(0) })
    .unknown(true)
    .pattern(Joi.string(), timerSchema),
  on: Joi.object().unknown(true).pattern(Joi.string(), times),
  off: Joi.object().unknown(true).pattern(Joi.string(), times),
  timezone: Joi.string()
});
