const fs = require('smart-fs');
const path = require('path');
const expect = require('chai').expect;
const { describe } = require('node-tdd');
const Log = require('../../src/util/log');

describe('Testing log.js', {
  timestamp: '2021-03-26T03:05:31.471Z',
  useTmpDir: true,
  record: console
}, () => {
  let logFile;
  let log;
  let check;
  beforeEach(({ dir, recorder }) => {
    logFile = path.join(dir, 'out.txt');
    log = Log({ logFile });
    check = (...args) => {
      log(...args);
      return {
        equals: (expected) => {
          expect(recorder.get()).to.deep.equal([expected]);
          expect(fs.smartRead(logFile)).to.deep.equal([expected]);
        }
      };
    };
  });

  it('Testing basic', () => {
    check('msg').equals('[2021-03-26T03:05:31.471Z]: msg');
  });

  it('Testing log level', () => {
    check('info', 'msg').equals('[2021-03-26T03:05:31.471Z] [INFO]: msg');
  });
});
