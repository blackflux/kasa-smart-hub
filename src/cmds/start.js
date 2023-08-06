import fs from 'smart-fs';
import Hub from '../module/hub.js';

export default {
  command: 'start [configFile]',
  desc: 'Start server.',
  builder: {},
  handler: async ({ configFile = 'config' }) => {
    const filepath = fs.guessFile(configFile);
    if (!fs.existsSync(filepath)) {
      throw new Error('Configuration file not found...');
    }
    const config = fs.smartRead(filepath);
    const hub = Hub(config);
    await hub.start();
    return hub;
  }
};
