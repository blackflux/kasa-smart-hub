const path = require('path');
const expect = require('chai').expect;
const { describe } = require('node-tdd');
const Log = require('../../src/util/log');
const Apply = require('../../src/util/apply');

describe('Testing apply.js', {
  timestamp: '2021-03-26T03:05:31.471Z',
  useTmpDir: true,
  record: console
}, () => {
  let logFile;
  let log;
  let apply;
  let check;
  beforeEach(({ dir, recorder }) => {
    logFile = path.join(dir, 'out.txt');
    log = Log({ logFile });
    apply = Apply(log, 1);
    check = async (...args) => {
      const result = await apply(...args);
      return {
        result,
        logs: recorder.get()
      };
    };
  });

  it('Testing basic', async () => {
    const {
      result,
      logs
    } = await check({ a: { b: (x, y) => x + y } }, 'a.b', 1, 2);
    expect(result).to.equal(3);
    expect(logs).to.deep.equal([]);
  });

  it('Testing retry error', async () => {
    let myCode;
    const processExit = process.exit;
    process.exit = (code) => {
      myCode = code;
    };
    const {
      result,
      logs
    } = await check({
      alias: 'Device',
      a: () => {
        throw new Error();
      }
    }, 'a', 1, {});
    expect(result).to.equal(undefined);
    expect(logs).to.deep.equal([
      '[2021-03-26T03:05:31.471Z] [ERROR]: Permanent Retry Error: Device.a(1, [object Object])'
    ]);
    expect(myCode).to.deep.equal(1);
    process.exit = processExit;
  });
});
