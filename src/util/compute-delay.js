const assert = require('assert');
const secondsUntilNextTime = require('./seconds-until-next-time');

module.exports = (alias, state, config) => {
  let delay = 0;
  if (state === true) {
    // eslint-disable-next-line no-underscore-dangle
    delay = alias in config.timer ? config.timer[alias] : config.timer.__default;
    if (alias in config.off) {
      const delayByTime = secondsUntilNextTime(config.off[alias], config.timezone);
      if (delayByTime < delay) {
        delay = delayByTime;
      }
    }
  } else {
    assert(state === false);
    if (alias in config.on) {
      delay = secondsUntilNextTime(config.on[alias], config.timezone);
    }
  }
  return delay >= 24 * 60 * 60 ? 0 : delay;
};
