const { formatToTimeZone } = require('date-fns-timezone');

const DAY_IN_SECONDS = 24 * 60 * 60;

const getCurrentSeconds = (timezone) => {
  const [h, m, s] = formatToTimeZone(new Date(), 'HH:mm:ss', { timeZone: timezone }).split(':');
  return parseInt(h, 10) * 60 * 60 + parseInt(m, 10) * 60 + parseInt(s, 10);
};

const timeAsSeconds = (time) => {
  const [h, m] = time.split(':');
  return parseInt(h, 10) * 60 * 60 + parseInt(m, 10) * 60;
};

module.exports = (times, timezone) => {
  let result = Number.MAX_SAFE_INTEGER;
  const currentSeconds = getCurrentSeconds(timezone);
  times.forEach((time) => {
    let timeSeconds = timeAsSeconds(time);
    if (timeSeconds < currentSeconds) {
      timeSeconds += DAY_IN_SECONDS;
    }
    const diff = timeSeconds - currentSeconds;
    if (diff < result) {
      result = diff;
    }
  });
  return result;
};
