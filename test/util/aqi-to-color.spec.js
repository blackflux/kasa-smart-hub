import { expect } from 'chai';
import { describe } from 'node-tdd';
import aqiToColor from '../../src/util/aqi-to-color.js';

describe('Testing aqi-to-color.js', () => {
  it('Testing exact colors', async () => {
    expect(aqiToColor(300)).to.equal('#41007e');
    expect(aqiToColor(200)).to.equal('#8f3f97');
    expect(aqiToColor(150)).to.equal('#ff0000');
    expect(aqiToColor(100)).to.equal('#ff7e00');
    expect(aqiToColor(50)).to.equal('#ffff00');
    expect(aqiToColor(0)).to.equal('#68e143');
  });

  it('Testing out of bound colors', async () => {
    expect(aqiToColor(350)).to.equal('#41007e');
    expect(aqiToColor(301)).to.equal('#41007e');
    expect(aqiToColor(250)).to.equal('#681f8a');
    expect(aqiToColor(175)).to.equal('#c71f4b');
    expect(aqiToColor(125)).to.equal('#ff3f00');
    expect(aqiToColor(75)).to.equal('#ffbe00');
    expect(aqiToColor(25)).to.equal('#b3f021');
    expect(aqiToColor(-1)).to.equal('#68e143');
    expect(aqiToColor(-50)).to.equal('#68e143');
  });
});
