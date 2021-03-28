const Joi = require('joi-strict');

const timerSchema = Joi.number().integer().min(60);

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
  links: Joi.object().pattern(Joi.string(), Joi.array().items(Joi.string())),
  timer: Joi.object()
    .keys({ __default: Joi.number().integer().min(0) })
    .unknown(true)
    .pattern(Joi.string(), timerSchema)
});
