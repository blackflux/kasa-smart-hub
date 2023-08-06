import path from 'path';
import fs from 'smart-fs';
import { expect } from 'chai';
import { describe } from 'node-tdd';
import start from '../../src/cmds/start.js';
import Mocker from '../helper/mocker.js';

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
    const config = await fixture('config');
    fs.smartWrite(configFile, config);
    const cwd = process.cwd();
    process.chdir(dir);
    const hub = await start.handler({});
    await hub.stop();
    process.chdir(cwd);
  });
});
