#!/usr/bin/env node

import Yargs from 'yargs';
import start from './cmds/start.js';

export default Yargs(process.argv.slice(2))
  .command(start, 'start')
  .demandCommand()
  .help()
  .argv;
