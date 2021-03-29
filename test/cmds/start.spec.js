const fs = require('smart-fs');
const path = require('path');
const expect = require('chai').expect;
const { describe } = require('node-tdd');
const start = require('../../src/cmds/start');
const Mocker = require('../helper/mocker');

describe('Testing `start [configFile]`', { useTmpDir: true }, () => {
  before(async () => {
    await Mocker.start();
  });

  after(async () => {
    await Mocker.stop();
  });

  it('Testing missing config file', async ({ capture }) => {
    const err = await capture(() => start.handler({ configFile: 'unknown' }));
    expect(err.message).to.equal('Configuration file not found...');
  });

  it('Testing spawning server, default parameter', async ({ dir, fixture }) => {
    const configFile = path.join(dir, 'config.json');
    fs.smartWrite(configFile, fixture('config'));
    const cwd = process.cwd();
    process.chdir(dir);
    const hub = await start.handler({});
    await hub.stop();
    process.chdir(cwd);
  });
});
