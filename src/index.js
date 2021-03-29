#!/usr/bin/env node

const yargs = require('yargs');

module.exports = yargs
  .commandDir('cmds')
  .demandCommand()
  .help()
  .argv;
