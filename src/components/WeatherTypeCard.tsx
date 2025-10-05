import React from 'react';
import WeatherGlassCard from './WeatherGlassCard';
import type { WeatherSummary } from '../types';

interface WeatherTypeCardProps {
  weatherSummary: WeatherSummary;
}

const WeatherTypeCard: React.FC<WeatherTypeCardProps> = ({ weatherSummary }) => {
  const { weatherType, avgTemperature, maxTemperature, minTemperature, humidity, windSpeed } = weatherSummary;

  const getWeatherTypeStyle = (type: string) => {
    switch (type) {
      case 'Hot': return { icon: '🌡️', description: 'High temperature, beware of heat stroke' };
      case 'Cold': return { icon: '❄️', description: 'Low temperature, keep warm' };
      case 'Humid': return { icon: '💧', description: 'High humidity, beware of moisture' };
      case 'Windy': return { icon: '💨', description: 'Strong wind, be careful' };
      case 'Muggy': return { icon: '🔥', description: 'Muggy, ensure ventilation' };
      case 'Comfortable': return { icon: '😊', description: 'Comfortable weather' };
      default: return { icon: '❓', description: 'Unknown weather type' };
    }
  };

  // ✅ 定義主題顏色
  const weatherThemes = {
    Hot: { base: '#FF6B6B', darkText: '#8B0000' },
    Cold: { base: '#60A5FA', darkText: '#1E3A8A' },
    Humid: { base: '#4DD0E1', darkText: '#064E3B' },
    Windy: { base: '#FACC15', darkText: '#78350F' },
    Muggy: { base: '#FB923C', darkText: '#7C2D12' },
    Comfortable: { base: '#86EFAC', darkText: '#064E3B' },
  };

  // ✅ 根據天氣類型選擇主題
  const theme = weatherThemes[weatherType.type as keyof typeof weatherThemes] || weatherThemes.Comfortable;
  const style = getWeatherTypeStyle(weatherType.type);

  return (
    <WeatherGlassCard type={weatherType.type} className="p-6" style={{ color: theme.darkText }}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          {/* icon：保留輕陰影 */}
          <span className="text-3xl drop-shadow-[0_1px_3px_rgba(0,0,0,0.2)]">{style.icon}</span>
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

      {/* Middle data */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-white/20 rounded-lg p-3">
          <div className="text-sm opacity-90">Feels Like</div>
          <div className="text-xl font-bold">{weatherType.heatIndex}°C</div>
        </div>
        <div className="bg-white/20 rounded-lg p-3">
          <div className="text-sm opacity-90">Avg Temp</div>
          <div className="text-xl font-bold">{avgTemperature.avgValue}°C</div>
        </div>
      </div>

      {/* Bottom grid */}
      <div className="grid grid-cols-3 gap-2 text-sm">
        <div className="bg-white/20 rounded-lg p-2 text-center">
          <div className="opacity-90">Max</div>
          <div className="font-bold">{maxTemperature.avgValue}°C</div>
        </div>
        <div className="bg-white/20 rounded-lg p-2 text-center">
          <div className="opacity-90">Min</div>
          <div className="font-bold">{minTemperature.avgValue}°C</div>
        </div>
        <div className="bg-white/20 rounded-lg p-2 text-center">
          <div className="opacity-90">Humidity</div>
          <div className="font-bold">{humidity.avgValue}%</div>
        </div>
      </div>

      <div className="mt-4 text-xs opacity-80">
        <p>Wind Speed: {windSpeed.avgValue} km/h</p>
        <p className="mt-1">{weatherType.description}</p>
      </div>
    </WeatherGlassCard>
  );
};

export default WeatherTypeCard;