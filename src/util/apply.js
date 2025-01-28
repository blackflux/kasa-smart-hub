const delay = (ms) => new Promise((resolve) => {
  setTimeout(resolve, ms);
});

export default (log, timeout = 1000) => async (device, cmd, ...args) => {
  const path = cmd.split('.');
  const fn = path.pop();
  for (let i = 0; i < 10; i += 1) {
    try {
      // eslint-disable-next-line no-await-in-loop
      return await path.reduce((prev, cur) => prev[cur], device)[fn](...args);
    } catch {
      // eslint-disable-next-line no-await-in-loop
      await delay(timeout);
    }
  }
  log(
    'error',
    `Permanent Retry Error: ${device.alias}.${cmd}(${args.map((arg) => String(arg)).join(', ')})`
  );
  return process.exit(1);
};
