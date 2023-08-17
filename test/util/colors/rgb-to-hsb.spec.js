import { expect } from 'chai';
import { describe } from 'node-tdd';
import rgbToHsb from '../../../src/util/colors/rgb-to-hsb.js';

describe('Testing rgb-to-hsb.js', () => {
  it('Testing basic', async () => {
    expect(rgbToHsb(219, 152, 52)).to.deep.equal([36, 76, 86]);
    expect(rgbToHsb(52, 219, 152)).to.deep.equal([156, 76, 86]);
    expect(rgbToHsb(52, 152, 219)).to.deep.equal([204, 76, 86]);
    expect(rgbToHsb(255, 255, 255)).to.deep.equal([0, 0, 100]);
    expect(rgbToHsb(0, 0, 255)).to.deep.equal([240, 100, 100]);
    expect(rgbToHsb(255, 0, 4)).to.deep.equal([359, 100, 100]);
    expect(rgbToHsb(0, 0, 0)).to.deep.equal([0, 0, 0]);
  });
});
