import aqibot from 'aqi-bot';

export default async (data) => {
  const [pm25, pm10] = await Promise.all([
    aqibot.AQICalculator.getAQIResult('PM2.5', data['pm2.5']),
    aqibot.AQICalculator.getAQIResult('PM10', data['pm10.0'])
  ]);
  return Math.max(pm25.aqi, pm10.aqi);
};
