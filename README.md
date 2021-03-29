[![Build Status](https://circleci.com/gh/blackflux/kasa-smart-hub.png?style=shield)](https://circleci.com/gh/blackflux/kasa-smart-hub)
[![Test Coverage](https://img.shields.io/coveralls/blackflux/kasa-smart-hub/master.svg)](https://coveralls.io/github/blackflux/kasa-smart-hub?branch=master)
[![Dependabot Status](https://api.dependabot.com/badges/status?host=github&repo=blackflux/kasa-smart-hub)](https://dependabot.com)
[![Dependencies](https://david-dm.org/blackflux/kasa-smart-hub/status.svg)](https://david-dm.org/blackflux/kasa-smart-hub)
[![NPM](https://img.shields.io/npm/v/kasa-smart-hub.svg)](https://www.npmjs.com/package/kasa-smart-hub)
[![Downloads](https://img.shields.io/npm/dt/kasa-smart-hub.svg)](https://www.npmjs.com/package/kasa-smart-hub)
[![Semantic-Release](https://github.com/blackflux/js-gardener/blob/master/assets/icons/semver.svg)](https://github.com/semantic-release/semantic-release)
[![Gardener](https://github.com/blackflux/js-gardener/blob/master/assets/badge.svg)](https://github.com/blackflux/js-gardener)

# kasa-smart-hub

Virtual Smart Hub for TP-Link Kasa Smart Home

Designed to be run on a LAN server, e.g. on a [Raspberry Pi](https://en.wikipedia.org/wiki/Raspberry_Pi).

## How to

Install as global npm packages. Then create configuration file and start with

```sh
kasa-smart-hub /path/to/config.json
```

## Config

Configuration can be in multiple formats. Most likely you want to use `config.js` or `config.json`.

### logFile

Where events logs are stored

### links

Object that contains "linked" switches that are always executed together.

### timer

Used to automatically switch off devices

#### __default

Default fallback timer. Can be set to zero to disable.

## Config Example

```js
const path = require('path');

module.exports = {
  logFile: path.join(__dirname, 'kasa-logs.txt'),
  links: {
    'kitchen-lights': [
      // when either of these is switched on / off the other one will also switch on / off
      'Kitchen Counter Lights',
      'Kitchen Ceiling Light'
    ]
  },
  timer: {
    __default: 8 * 60 * 60, // switch off everything after eight hours
    'Bathroom Fan': 60 * 60 // switch off after one hour
  }
};
```

## Configure Raspberry Pi Auto Start

Ensure you are running a recent node version. Install with

`npm install -g kasa-smart-hub`

Place

```
[Service]
WorkingDirectory=/home/pi/kasa-smart-hub
ExecStart=kasa-smart-hub start /home/pi/kasa-smart-hub/config.js
Restart=always
StandardOutput=syslog
StandardError=syslog
SyslogIdentifier=
User=pi
Group=pi
[Install]
WantedBy=multi-user.target
```

in `/etc/systemd/system/kasa-smart-hub.service`.

Ensure it is readable/writeable/executable by the appropriate user.

Now enable service with `sudo systemctl enable kasa-smart-hub`

To start the service right away run `sudo systemctl start kasa-smart-hub`

## Acknowledgements

This project relies on [tplink-smarthome-api](https://github.com/plasticrake/tplink-smarthome-api). Documentation for that project can be found [here](https://freesoft.dev/program/63196852#startDiscovery).
