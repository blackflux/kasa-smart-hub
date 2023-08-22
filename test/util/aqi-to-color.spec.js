import { expect } from 'chai';
import { describe } from 'node-tdd';
import aqiToColor from '../../src/util/aqi-to-color.js';
import { ERROR_COLOR } from '../../src/resources/config.js';

describe('Testing aqi-to-color.js', () => {
  it('Testing exact colors', async () => {
    expect(aqiToColor(800)).to.equal('#002e91');
    expect(aqiToColor(300)).to.equal('#5e00ff');
    expect(aqiToColor(200)).to.equal('#8f3f97');
    expect(aqiToColor(150)).to.equal('#ff0000');
    expect(aqiToColor(100)).to.equal('#ff7e00');
    expect(aqiToColor(50)).to.equal('#ffff00');
    expect(aqiToColor(0)).to.equal('#68e143');
  });

  it('Testing out of bound colors', async () => {
    expect(aqiToColor(850)).to.equal('#002e91');
    expect(aqiToColor(801)).to.equal('#002e91');
    expect(aqiToColor(750)).to.equal('#09299c');
    expect(aqiToColor(550)).to.equal('#2f17c8');
    expect(aqiToColor(350)).to.equal('#5404f4');
    expect(aqiToColor(301)).to.equal('#5d00fe');
    expect(aqiToColor(250)).to.equal('#761fcb');
    expect(aqiToColor(175)).to.equal('#c71f4b');
    expect(aqiToColor(125)).to.equal('#ff3f00');
    expect(aqiToColor(75)).to.equal('#ffbe00');
    expect(aqiToColor(25)).to.equal('#b3f021');
    expect(aqiToColor(-1)).to.equal('#68e143');
    expect(aqiToColor(-50)).to.equal('#68e143');
  });

  it('Testing NaN', async () => {
    expect(aqiToColor(Number.NaN)).to.equal(ERROR_COLOR);
  });
});
