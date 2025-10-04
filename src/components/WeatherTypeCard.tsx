import React from 'react';
import type { WeatherSummary } from '../types';

interface WeatherTypeCardProps {
  weatherSummary: WeatherSummary;
}

const WeatherTypeCard: React.FC<WeatherTypeCardProps> = ({ weatherSummary }) => {
  const { weatherType, avgTemperature, maxTemperature, minTemperature, humidity, windSpeed } = weatherSummary;

  // 根據天氣類型選擇顏色和圖標
  const getWeatherTypeStyle = (type: string) => {
    switch (type) {
      case '炎熱':
        return {
          bgColor: 'bg-red-500',
          textColor: 'text-red-100',
          icon: '🌡️',
          description: '高溫高濕，注意防暑'
        };
      case '寒冷':
        return {
          bgColor: 'bg-blue-500',
          textColor: 'text-blue-100',
          icon: '❄️',
          description: '低溫環境，注意保暖'
        };
      case '潮濕':
        return {
          bgColor: 'bg-gray-500',
          textColor: 'text-gray-100',
          icon: '💧',
          description: '高濕度或降雨，注意防潮'
        };
      case '強風':
        return {
          bgColor: 'bg-yellow-500',
          textColor: 'text-yellow-100',
          icon: '💨',
          description: '強風環境，注意安全'
        };
      case '悶熱':
        return {
          bgColor: 'bg-orange-500',
          textColor: 'text-orange-100',
          icon: '🔥',
          description: '悶熱環境，注意通風'
        };
      case '舒適':
        return {
          bgColor: 'bg-green-500',
          textColor: 'text-green-100',
          icon: '😊',
          description: '舒適的天氣條件'
        };
      default:
        return {
          bgColor: 'bg-gray-400',
          textColor: 'text-gray-100',
          icon: '❓',
          description: '未知天氣類型'
        };
    }
  };

  const style = getWeatherTypeStyle(weatherType.type);

  return (
    <div className={`${style.bgColor} ${style.textColor} rounded-lg p-6 shadow-lg`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{style.icon}</span>
          <div>
            <h3 className="text-xl font-bold">天氣類型</h3>
            <p className="text-sm opacity-90">{style.description}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold">{weatherType.type}</div>
          <div className="text-sm opacity-90">體感溫度</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-black bg-opacity-20 rounded-lg p-3">
          <div className="text-sm opacity-90">體感溫度</div>
          <div className="text-xl font-bold">{weatherType.heatIndex}°C</div>
        </div>
        <div className="bg-black bg-opacity-20 rounded-lg p-3">
          <div className="text-sm opacity-90">平均溫度</div>
          <div className="text-xl font-bold">{avgTemperature.avgValue}°C</div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 text-sm">
        <div className="bg-black bg-opacity-20 rounded-lg p-2 text-center">
          <div className="opacity-90">最高溫</div>
          <div className="font-bold">{maxTemperature.avgValue}°C</div>
        </div>
        <div className="bg-black bg-opacity-20 rounded-lg p-2 text-center">
          <div className="opacity-90">最低溫</div>
          <div className="font-bold">{minTemperature.avgValue}°C</div>
        </div>
        <div className="bg-black bg-opacity-20 rounded-lg p-2 text-center">
          <div className="opacity-90">濕度</div>
          <div className="font-bold">{humidity.avgValue}%</div>
        </div>
      </div>

      <div className="mt-4 text-xs opacity-80">
        <p>風速: {windSpeed.avgValue} km/h</p>
        <p className="mt-1">{weatherType.description}</p>
      </div>
    </div>
  );
};

export default WeatherTypeCard;
