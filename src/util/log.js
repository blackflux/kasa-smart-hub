const fs = require('fs');

module.exports = (config) => (...args) => {
  const log = [
    `[${new Date().toISOString()}]`,
    `${args.length === 1 ? '' : ` [${args[0].toUpperCase()}]`}: `,
    `${args[args.length - 1]}`
  ].join('');
  fs.appendFileSync(config.logFile, `${log}\n`);
  // eslint-disable-next-line no-console
  console.log(log);
};
