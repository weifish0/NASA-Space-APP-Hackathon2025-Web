import React from 'react';
import type { WeatherSummary } from '../types';

interface WeatherTypeCardProps {
  weatherSummary: WeatherSummary;
}

const WeatherTypeCard: React.FC<WeatherTypeCardProps> = ({ weatherSummary }) => {
  const { weatherType, avgTemperature, maxTemperature, minTemperature, humidity, windSpeed } = weatherSummary;

  // Select color and icon based on weather type
  const getWeatherTypeStyle = (type: string) => {
    switch (type) {
      case 'Hot':
        return {
          bgColor: 'bg-red-500',
          textColor: 'text-red-100',
          icon: '🌡️',
          description: 'High temperature and humidity, beware of heat stroke'
        };
      case 'Cold':
        return {
          bgColor: 'bg-blue-500',
          textColor: 'text-blue-100',
          icon: '❄️',
          description: 'Low temperature environment, keep warm'
        };
      case 'Humid':
        return {
          bgColor: 'bg-gray-500',
          textColor: 'text-gray-100',
          icon: '💧',
          description: 'High humidity or rainfall, beware of moisture'
        };
      case 'Windy':
        return {
          bgColor: 'bg-yellow-500',
          textColor: 'text-yellow-100',
          icon: '💨',
          description: 'Strong wind environment, be careful'
        };
      case 'Muggy':
        return {
          bgColor: 'bg-orange-500',
          textColor: 'text-orange-100',
          icon: '🔥',
          description: 'Muggy environment, ensure ventilation'
        };
      case 'Comfortable':
        return {
          bgColor: 'bg-green-500',
          textColor: 'text-green-100',
          icon: '😊',
          description: 'Comfortable weather conditions'
        };
      default:
        return {
          bgColor: 'bg-gray-400',
          textColor: 'text-gray-100',
          icon: '❓',
          description: 'Unknown weather type'
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
            <h3 className="text-xl font-bold">Weather Type</h3>
            <p className="text-sm opacity-90">{style.description}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold">{weatherType.type}</div>
          <div className="text-sm opacity-90">Feels Like</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-black bg-opacity-20 rounded-lg p-3">
          <div className="text-sm opacity-90">Feels Like</div>
          <div className="text-xl font-bold">{weatherType.heatIndex}°C</div>
        </div>
        <div className="bg-black bg-opacity-20 rounded-lg p-3">
          <div className="text-sm opacity-90">Average Temperature</div>
          <div className="text-xl font-bold">{avgTemperature.avgValue}°C</div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 text-sm">
        <div className="bg-black bg-opacity-20 rounded-lg p-2 text-center">
          <div className="opacity-90">Max Temp</div>
          <div className="font-bold">{maxTemperature.avgValue}°C</div>
        </div>
        <div className="bg-black bg-opacity-20 rounded-lg p-2 text-center">
          <div className="opacity-90">Min Temp</div>
          <div className="font-bold">{minTemperature.avgValue}°C</div>
        </div>
        <div className="bg-black bg-opacity-20 rounded-lg p-2 text-center">
          <div className="opacity-90">Humidity</div>
          <div className="font-bold">{humidity.avgValue}%</div>
        </div>
      </div>

      <div className="mt-4 text-xs opacity-80">
        <p>Wind Speed: {windSpeed.avgValue} km/h</p>
        <p className="mt-1">{weatherType.description}</p>
      </div>
    </div>
  );
};

export default WeatherTypeCard;
