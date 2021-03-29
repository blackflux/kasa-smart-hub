module.exports = (client) => async (filterFn, cbFn) => {
  const devices = [...client.devices.values()]
    .filter((d) => filterFn(d));
  if (devices.length !== 0) {
    await Promise.all(devices.map((device) => cbFn(device)));
  }
};
