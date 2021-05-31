const { tz } = require('moment-timezone');
const { time: timeRegex } = require('../resources/regex');

const dayOfWeekMap = {
  Su: 0,
  Mo: 1,
  Tu: 2,
  We: 3,
  Th: 4,
  Fr: 5,
  Sa: 6
};

const formatAtTimezone = (date, fmt, timezone) => tz(date, timezone).format(fmt);

const getUntilInSeconds = (currentDateObj, time, timezone) => {
  const { weekday, hours, minutes } = timeRegex.exec(time).groups;
  const startMinute = parseInt(hours, 10) * 60 + parseInt(minutes, 10);

  const [
    dateStr, hourStr, minuteStr, secondStr
  ] = formatAtTimezone(currentDateObj, 'YYYY-MM-DD HH mm ss', timezone).split(' ');
  const nowMinute = parseInt(hourStr, 10) * 60 + parseInt(minuteStr, 10);

  const startDate = new Date(dateStr);
  if (startMinute <= nowMinute) {
    startDate.setUTCDate(startDate.getUTCDate() + 1);
  }
  while (
    typeof weekday === 'string'
    && startDate.getUTCDay() !== dayOfWeekMap[weekday]
  ) {
    startDate.setUTCDate(startDate.getUTCDate() + 1);
  }

  const nowTime = formatAtTimezone(`${dateStr}T${hourStr}:${minuteStr}:${secondStr}`, 'X', timezone);
  const startTime = formatAtTimezone(`${startDate.toISOString().slice(0, 10)}T${hours}:${minutes}:00`, 'X', timezone);
  return Math.max(parseInt(startTime, 10) - parseInt(nowTime, 10), 0);
};

module.exports = (times, timezone) => {
  let result = Number.MAX_SAFE_INTEGER;
  const currentDateObj = new Date();
  times.forEach((time) => {
    const diff = getUntilInSeconds(currentDateObj, time, timezone);
    if (diff < result) {
      result = diff;
    }
  });
  return result;
};
