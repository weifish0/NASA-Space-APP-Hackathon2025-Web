import type { WeatherApiResponse } from '../types';

// 模擬 API 回應數據
export const mockApiResponse: WeatherApiResponse = {
  location: {
    name: "台北市, 台灣",
    lat: 25.0330,
    lon: 121.5654,
  },
  summary: {
    avgTemperature: {
      avgValue: 28,
      unit: "°C",
      description: "歷史平均溫度",
    },
    maxTemperature: {
      avgValue: 32,
      unit: "°C",
      description: "歷史平均最高溫",
    },
    minTemperature: {
      avgValue: 24,
      unit: "°C",
      description: "歷史平均最低溫",
    },
    precipitation: {
      probability: 65,
      unit: "%",
      description: "發生降雨機率",
    },
    windSpeed: {
      avgValue: 15,
      unit: "km/h",
      description: "歷史平均風速",
    },
    humidity: {
      avgValue: 75,
      unit: "%",
      description: "歷史平均相對濕度",
    },
    weatherType: {
      type: "悶熱",
      heatIndex: 31.2,
      unit: "°C",
      description: "天氣類型：悶熱，體感溫度：31.2°C",
    },
  },
  trendData: [
    { year: 2005, avgTemperature: 27.5, maxTemperature: 31.5, minTemperature: 23.5, precipitation: 5, windSpeed: 14, humidity: 72, weatherType: "舒適" },
    { year: 2006, avgTemperature: 28.1, maxTemperature: 32.1, minTemperature: 24.1, precipitation: 8, windSpeed: 15, humidity: 75, weatherType: "悶熱" },
    { year: 2007, avgTemperature: 27.8, maxTemperature: 31.8, minTemperature: 23.8, precipitation: 12, windSpeed: 13, humidity: 78, weatherType: "潮濕" },
    { year: 2008, avgTemperature: 28.3, maxTemperature: 32.3, minTemperature: 24.3, precipitation: 7, windSpeed: 16, humidity: 70, weatherType: "舒適" },
    { year: 2009, avgTemperature: 27.9, maxTemperature: 31.9, minTemperature: 23.9, precipitation: 9, windSpeed: 14, humidity: 74, weatherType: "悶熱" },
    { year: 2010, avgTemperature: 28.5, maxTemperature: 32.5, minTemperature: 24.5, precipitation: 11, windSpeed: 15, humidity: 76, weatherType: "悶熱" },
    { year: 2011, avgTemperature: 28.0, maxTemperature: 32.0, minTemperature: 24.0, precipitation: 6, windSpeed: 13, humidity: 71, weatherType: "舒適" },
    { year: 2012, avgTemperature: 28.7, maxTemperature: 32.7, minTemperature: 24.7, precipitation: 10, windSpeed: 17, humidity: 73, weatherType: "強風" },
    { year: 2013, avgTemperature: 28.2, maxTemperature: 32.2, minTemperature: 24.2, precipitation: 8, windSpeed: 15, humidity: 75, weatherType: "悶熱" },
    { year: 2014, avgTemperature: 28.8, maxTemperature: 32.8, minTemperature: 24.8, precipitation: 13, windSpeed: 16, humidity: 79, weatherType: "潮濕" },
    { year: 2015, avgTemperature: 29.1, maxTemperature: 33.1, minTemperature: 25.1, precipitation: 9, windSpeed: 14, humidity: 77, weatherType: "炎熱" },
    { year: 2016, avgTemperature: 28.9, maxTemperature: 32.9, minTemperature: 24.9, precipitation: 11, windSpeed: 15, humidity: 76, weatherType: "悶熱" },
    { year: 2017, avgTemperature: 29.3, maxTemperature: 33.3, minTemperature: 25.3, precipitation: 7, windSpeed: 16, humidity: 78, weatherType: "炎熱" },
    { year: 2018, avgTemperature: 29.0, maxTemperature: 33.0, minTemperature: 25.0, precipitation: 12, windSpeed: 15, humidity: 80, weatherType: "潮濕" },
    { year: 2019, avgTemperature: 29.2, maxTemperature: 33.2, minTemperature: 25.2, precipitation: 8, windSpeed: 17, humidity: 79, weatherType: "強風" },
    { year: 2020, avgTemperature: 29.5, maxTemperature: 33.5, minTemperature: 25.5, precipitation: 10, windSpeed: 16, humidity: 81, weatherType: "炎熱" },
    { year: 2021, avgTemperature: 29.1, maxTemperature: 33.1, minTemperature: 25.1, precipitation: 9, windSpeed: 15, humidity: 77, weatherType: "悶熱" },
    { year: 2022, avgTemperature: 29.7, maxTemperature: 33.7, minTemperature: 25.7, precipitation: 11, windSpeed: 16, humidity: 82, weatherType: "炎熱" },
    { year: 2023, avgTemperature: 29.4, maxTemperature: 33.4, minTemperature: 25.4, precipitation: 13, windSpeed: 17, humidity: 83, weatherType: "潮濕" },
    { year: 2024, avgTemperature: 29.5, maxTemperature: 33.5, minTemperature: 25.5, precipitation: 12, windSpeed: 16, humidity: 84, weatherType: "炎熱" },
  ],
};

// 模擬 API 調用函數
export const fetchWeatherData = async (location: { lat: number; lon: number }, date: string): Promise<WeatherApiResponse> => {
  // 模擬網路延遲
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // 根據位置和日期生成不同的模擬數據
  const baseData = { ...mockApiResponse };
  
  // 根據緯度調整溫度
  const latFactor = Math.abs(location.lat - 25) / 10;
  baseData.summary.avgTemperature.avgValue = Math.round((28 + latFactor * 2) * 10) / 10;
  baseData.summary.maxTemperature.avgValue = Math.round((32 + latFactor * 2) * 10) / 10;
  baseData.summary.minTemperature.avgValue = Math.round((24 + latFactor * 2) * 10) / 10;
  
  // 根據經度調整風速
  const lonFactor = Math.abs(location.lon - 121) / 10;
  baseData.summary.windSpeed.avgValue = Math.round((15 + lonFactor) * 10) / 10;
  
  // 根據日期調整降雨機率和濕度
  const month = new Date(date).getMonth();
  const seasonalFactor = Math.sin((month / 12) * 2 * Math.PI) * 10;
  baseData.summary.precipitation.probability = Math.round(65 + seasonalFactor);
  baseData.summary.humidity.avgValue = Math.round(75 + seasonalFactor);
  
  // 重新計算天氣類型
  const avgTemp = baseData.summary.avgTemperature.avgValue;
  const maxTemp = baseData.summary.maxTemperature.avgValue;
  const minTemp = baseData.summary.minTemperature.avgValue;
  const humidity = baseData.summary.humidity.avgValue;
  const windSpeed = baseData.summary.windSpeed.avgValue;
  const precip = baseData.summary.precipitation.probability;
  
  // 簡單的天氣類型分類
  let weatherType = "舒適";
  if (maxTemp > 30 && humidity > 60) weatherType = "炎熱";
  else if (minTemp < 10) weatherType = "寒冷";
  else if (precip > 5 || humidity > 80) weatherType = "潮濕";
  else if (windSpeed > 20) weatherType = "強風";
  else if (25 <= avgTemp <= 30 && humidity > 70) weatherType = "悶熱";
  
  baseData.summary.weatherType.type = weatherType;
  baseData.summary.weatherType.heatIndex = Math.round((avgTemp + humidity * 0.1) * 10) / 10;
  baseData.summary.weatherType.description = `天氣類型：${weatherType}，體感溫度：${baseData.summary.weatherType.heatIndex}°C`;
  
  return baseData;
};
