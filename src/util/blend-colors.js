import hexToRgb from './colors/hex-to-rgb.js';
import rgbToHex from './colors/rgb-to-hex.js';

export default (col1, col2, w) => {
  const c1 = hexToRgb(col1);
  const c2 = hexToRgb(col2);
  return rgbToHex(
    ...['r', 'g', 'b']
      .map((c, i) => Math.max(0, Math.min(255, (c1[i] * w + c2[i] * (1 - w)))))
  );
};
