// eslint-disable-next-line @blackflux/rules/istanbul-prevent-ignore
/* istanbul ignore file */
const path = require('path');
const Hub = require('../src/module/hub');

const hub = Hub({
  logFile: path.join(__dirname, 'kasa-logs.txt'),
  links: {},
  timer: {
    __default: 0
  }
});

if (require.main === module) {
  hub.start();
}
