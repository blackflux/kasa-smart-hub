const path = require('path');

module.exports = {
  defaultTimerDuration: 23 * 60 * 60,
  discoveryConfig: {
    broadcast: '255.255.255.255',
    port: 1234
  },
  logFile: path.join(__dirname, 'kasa-logs.txt'),
  links: {
    'kitchen-lights': [
      'Laundry Light',
      'Kitchen Island',
      'Kitchen High'
    ]
  },
  timer: {
    'Master Bathroom Light': 2 * 60 * 60,
    'Master Bathroom Fan': 3 * 60 * 60,
    'Guest Bathroom Light': 60 * 60,
    'Guest Bathroom Fan': 2 * 60 * 60,
    'TV Mood Light': 3 * 60 * 60,
    'Fireplace Bottom': 3 * 60 * 60,
    'Dresser Light': 10 * 60
  }
};
