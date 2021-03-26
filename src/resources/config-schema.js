const Joi = require('joi-strict');

const timerSchema = Joi.number().integer().min(60);

module.exports = Joi.object().keys({
  defaultTimerDuration: timerSchema,
  logFile: Joi.string(),
  links: Joi.object().pattern(Joi.string(), Joi.array().items(Joi.string())),
  timer: Joi.object().pattern(Joi.string(), timerSchema)
});
