const breakpoints = {
  'pm2.5': [
    { min: 0.0, max: 12.0, index: { min: 0, max: 50 } },
    { min: 12.1, max: 35.4, index: { min: 51, max: 100 } },
    { min: 35.5, max: 55.4, index: { min: 101, max: 150 } },
    { min: 55.5, max: 150.4, index: { min: 151, max: 200 } },
    { min: 150.5, max: 250.4, index: { min: 201, max: 300 } },
    { min: 250.5, max: 350.4, index: { min: 301, max: 400 } },
    { min: 350.5, max: 500.4, index: { min: 401, max: 500 } }
  ],
  'pm10.0': [
    { min: 0, max: 54, index: { min: 0, max: 50 } },
    { min: 55, max: 154, index: { min: 51, max: 100 } },
    { min: 155, max: 254, index: { min: 101, max: 150 } },
    { min: 255, max: 354, index: { min: 151, max: 200 } },
    { min: 355, max: 424, index: { min: 201, max: 300 } },
    { min: 425, max: 504, index: { min: 301, max: 400 } },
    { min: 505, max: 604, index: { min: 401, max: 500 } }
  ]
};

export default (data) => {
  let aqi = 0;
  Object.entries(breakpoints).forEach(([field, concentrations]) => {
    const value = data[field];
    let bracket = concentrations[0];
    for (let i = 0; i < concentrations.length; i += 1) {
      const current = concentrations[i];
      if (current.min <= value) {
        bracket = current;
      }
    }
    const interval = (bracket.max - bracket.min);
    const percentage = (value - bracket.min) / interval;
    const result = bracket.index.min + (bracket.index.max - bracket.index.min) * percentage;
    aqi = Math.max(result, aqi);
  });
  return Math.round(aqi);
};
