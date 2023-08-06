#!/usr/bin/env node

import Yargs from 'yargs';
import start from './cmds/start.js';

export default Yargs(process.argv)
  .command(start, 'start')
  .demandCommand()
  .help()
  .argv;
