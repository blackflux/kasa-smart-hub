import path from 'path';
import fs from 'smart-fs';

export default {
  discoveryConfig: {
    broadcast: '255.255.255.255',
    port: 1234
  },
  logFile: path.join(fs.dirname(import.meta.url), 'kasa-logs.txt'),
  links: {},
  timer: {
    __default: 12 * 60 * 60
  },
  on: {},
  off: {},
  timezone: 'America/Vancouver'
};
