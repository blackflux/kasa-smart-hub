import blendColors from './blend-colors.js';
import { ERROR_COLOR } from '../resources/config.js';

const colors = [
  [800, '#002e91'], // Above Scale
  [300, '#5e00ff'], // Hazardous
  [200, '#8f3f97'], // Very Unhealthy
  [150, '#ff0000'], // Unhealthy
  [100, '#ff7e00'], // Unhealthy for Sensitive Groups
  [50, '#ffff00'], // Moderate
  [0, '#68e143'] // Good
];

export default (aqi) => {
  if (Number.isNaN(aqi)) {
    return ERROR_COLOR;
  }
  const idx = colors.findIndex((c) => c[0] < aqi);
  if (idx === 0) {
    return colors[0][1];
  }
  if (idx === -1) {
    return colors[colors.length - 1][1];
  }

  const col1 = colors[idx - 1][1];
  const col2 = colors[idx][1];
  const w = (aqi - colors[idx][0]) / (colors[idx - 1][0] - colors[idx][0]);

  return blendColors(col1, col2, w);
};
