import { Device, UdpServer } from 'tplink-smarthome-simulator';

const devices = [];

export default {
  start: async () => {
    await UdpServer.start();
  },
  stop: async () => {
    await UdpServer.stop();
  },
  spawn: async (cfg) => {
    const device = new Device(cfg);
    devices.push(device);
    await device.start();
  },
  clear: async () => {
    while (devices.length !== 0) {
      // eslint-disable-next-line no-await-in-loop
      await devices.pop().stop();
    }
  }
};
