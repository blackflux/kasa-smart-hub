const path = require('path');

module.exports = {
  discoveryConfig: {
    broadcast: '255.255.255.255',
    port: 1234,
    discoveryTimeout: 10
  },
  logFile: path.join(__dirname, 'kasa-logs.txt'),
  links: {},
  timer: {
    __default: 12 * 60 * 60
  }
};
