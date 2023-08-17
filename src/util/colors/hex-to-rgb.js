export default (hex) => {
  const bigint = Number.parseInt(hex.substring(1), 16);
  // eslint-disable-next-line no-bitwise
  return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
};
