const Joi = require('joi-strict');

const timerSchema = Joi.number().integer().min(60);

module.exports = Joi.object().keys({
  broadcast: Joi.string().ip(),
  port: Joi.number().integer().min(0).max(65535),
  breakoutChildren: Joi.boolean(),
  discoveryInterval: Joi.number().integer().min(0),
  discoveryTimeout: Joi.number().integer().min(0),
  offlineTolerance: Joi.number().integer().min(0),
  defaultTimerDuration: timerSchema,
  logFile: Joi.string(),
  links: Joi.object().pattern(Joi.string(), Joi.array().items(Joi.string())),
  timer: Joi.object().pattern(Joi.string(), timerSchema)
});
