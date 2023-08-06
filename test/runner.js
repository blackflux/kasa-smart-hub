import path from 'path';
import fs from 'smart-fs';
import Hub from '../src/module/hub.js';

const hub = Hub({
  logFile: path.join(fs.dirname(import.meta.url), 'kasa-logs.txt'),
  links: {},
  timer: {
    __default: 0
  },
  on: {},
  off: {},
  timezone: 'America/Vancouver'
});

if (process.argv[1] === fs.filename(import.meta.url)) {
  hub.start();
}
