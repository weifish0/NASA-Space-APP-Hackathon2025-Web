import type { WeatherApiResponse } from '../types';

// 模擬 API 回應數據
export const mockApiResponse: WeatherApiResponse = {
  location: {
    name: "台北市, 台灣",
    lat: 25.0330,
    lon: 121.5654,
  },
  summary: {
    maxTemperature: {
      avgValue: 32,
      unit: "°C",
      description: "歷史平均最高溫",
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
  },
  trendData: [
    { year: 2005, maxTemperature: 31.5, precipitation: 5, windSpeed: 14 },
    { year: 2006, maxTemperature: 32.1, precipitation: 8, windSpeed: 15 },
    { year: 2007, maxTemperature: 31.8, precipitation: 12, windSpeed: 13 },
    { year: 2008, maxTemperature: 32.3, precipitation: 7, windSpeed: 16 },
    { year: 2009, maxTemperature: 31.9, precipitation: 9, windSpeed: 14 },
    { year: 2010, maxTemperature: 32.5, precipitation: 11, windSpeed: 15 },
    { year: 2011, maxTemperature: 32.0, precipitation: 6, windSpeed: 13 },
    { year: 2012, maxTemperature: 32.7, precipitation: 10, windSpeed: 17 },
    { year: 2013, maxTemperature: 32.2, precipitation: 8, windSpeed: 15 },
    { year: 2014, maxTemperature: 32.8, precipitation: 13, windSpeed: 16 },
    { year: 2015, maxTemperature: 33.1, precipitation: 9, windSpeed: 14 },
    { year: 2016, maxTemperature: 32.9, precipitation: 11, windSpeed: 15 },
    { year: 2017, maxTemperature: 33.3, precipitation: 7, windSpeed: 16 },
    { year: 2018, maxTemperature: 33.0, precipitation: 12, windSpeed: 15 },
    { year: 2019, maxTemperature: 33.2, precipitation: 8, windSpeed: 17 },
    { year: 2020, maxTemperature: 33.5, precipitation: 10, windSpeed: 16 },
    { year: 2021, maxTemperature: 33.1, precipitation: 9, windSpeed: 15 },
    { year: 2022, maxTemperature: 33.7, precipitation: 11, windSpeed: 16 },
    { year: 2023, maxTemperature: 33.4, precipitation: 13, windSpeed: 17 },
    { year: 2024, maxTemperature: 33.5, precipitation: 12, windSpeed: 16 },
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
  baseData.summary.maxTemperature.avgValue = Math.round((32 + latFactor * 2) * 10) / 10;
  
  // 根據經度調整風速
  const lonFactor = Math.abs(location.lon - 121) / 10;
  baseData.summary.windSpeed.avgValue = Math.round((15 + lonFactor) * 10) / 10;
  
  // 根據日期調整降雨機率
  const month = new Date(date).getMonth();
  const seasonalFactor = Math.sin((month / 12) * 2 * Math.PI) * 10;
  baseData.summary.precipitation.probability = Math.round(65 + seasonalFactor);
  
  return baseData;
};
