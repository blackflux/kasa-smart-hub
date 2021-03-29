const fs = require('smart-fs');
const Hub = require('../module/hub');

exports.command = 'start [configFile]';
exports.desc = 'Start server.';
exports.builder = {};
exports.handler = async ({ configFile = 'config' }) => {
  const filepath = fs.guessFile(configFile);
  if (!fs.existsSync(filepath)) {
    throw new Error('Configuration file not found...');
  }
  const config = fs.smartRead(filepath);
  const hub = Hub(config);
  await hub.start();
  return hub;
};
