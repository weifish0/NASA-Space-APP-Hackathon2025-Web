import React from 'react';
import ProbabilityCard from './ProbabilityCard';
import TrendChart from './TrendChart';
import WeatherTypeCard from './WeatherTypeCard';
import type { WeatherApiResponse } from '../types';

interface AnalysisDashboardProps {
  weatherData: WeatherApiResponse;
}

const AnalysisDashboard: React.FC<AnalysisDashboardProps> = ({ weatherData }) => {
  const { summary, trendData } = weatherData;

  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-6">
      {/* 標題區域 */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          天氣風險分析報告
        </h2>
        <p className="text-lg text-gray-600">
          {weatherData.location.name} - 歷史天氣數據分析
        </p>
      </div>

      {/* 天氣類型卡片 */}
      <div className="mb-8">
        <WeatherTypeCard weatherSummary={summary} />
      </div>

      {/* 概率卡片區域 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <ProbabilityCard
          title="平均溫度"
          value={`${summary.avgTemperature.avgValue}${summary.avgTemperature.unit}`}
          probability={`${Math.round((summary.avgTemperature.avgValue / 40) * 100)}% 機率`}
          icon="🌡️"
        />
        <ProbabilityCard
          title="最高溫度"
          value={`${summary.maxTemperature.avgValue}${summary.maxTemperature.unit}`}
          probability={`${Math.round((summary.maxTemperature.avgValue / 40) * 100)}% 機率`}
          icon="🔥"
        />
        <ProbabilityCard
          title="降雨機率"
          value={`${summary.precipitation.probability}${summary.precipitation.unit}`}
          probability={`${summary.precipitation.probability}% 機率`}
          icon="🌧️"
        />
        <ProbabilityCard
          title="平均風速"
          value={`${summary.windSpeed.avgValue}${summary.windSpeed.unit}`}
          probability={`${Math.round((summary.windSpeed.avgValue / 30) * 100)}% 機率`}
          icon="💨"
        />
      </div>

      {/* 額外數據卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <ProbabilityCard
          title="最低溫度"
          value={`${summary.minTemperature.avgValue}${summary.minTemperature.unit}`}
          probability={`${Math.round((summary.minTemperature.avgValue / 30) * 100)}% 機率`}
          icon="❄️"
        />
        <ProbabilityCard
          title="相對濕度"
          value={`${summary.humidity.avgValue}${summary.humidity.unit}`}
          probability={`${Math.round((summary.humidity.avgValue / 100) * 100)}% 機率`}
          icon="💧"
        />
      </div>

      {/* 趨勢圖表區域 */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          歷史趨勢分析
        </h3>
        <TrendChart data={trendData} />
      </div>

      {/* 數據摘要區域 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">
            📊 數據摘要
          </h4>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">分析期間:</span>
              <span className="font-medium">
                {Math.min(...trendData.map(d => d.year))} - {Math.max(...trendData.map(d => d.year))}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">數據點數:</span>
              <span className="font-medium">{trendData.length} 個年份</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">平均溫度範圍:</span>
              <span className="font-medium">
                {Math.min(...trendData.map(d => d.avgTemperature)).toFixed(1)}°C - {Math.max(...trendData.map(d => d.avgTemperature)).toFixed(1)}°C
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">最高溫度範圍:</span>
              <span className="font-medium">
                {Math.min(...trendData.map(d => d.maxTemperature)).toFixed(1)}°C - {Math.max(...trendData.map(d => d.maxTemperature)).toFixed(1)}°C
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">風速範圍:</span>
              <span className="font-medium">
                {Math.min(...trendData.map(d => d.windSpeed)).toFixed(1)} - {Math.max(...trendData.map(d => d.windSpeed)).toFixed(1)} km/h
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">濕度範圍:</span>
              <span className="font-medium">
                {Math.min(...trendData.map(d => d.humidity)).toFixed(1)}% - {Math.max(...trendData.map(d => d.humidity)).toFixed(1)}%
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">
            🔍 風險評估
          </h4>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${
                summary.maxTemperature.avgValue > 35 ? 'bg-red-500' : 
                summary.maxTemperature.avgValue > 30 ? 'bg-yellow-500' : 'bg-green-500'
              }`}></div>
              <span className="text-sm">
                高溫風險: {
                  summary.maxTemperature.avgValue > 35 ? '高' : 
                  summary.maxTemperature.avgValue > 30 ? '中' : '低'
                }
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${
                summary.precipitation.probability > 70 ? 'bg-red-500' : 
                summary.precipitation.probability > 40 ? 'bg-yellow-500' : 'bg-green-500'
              }`}></div>
              <span className="text-sm">
                降雨風險: {
                  summary.precipitation.probability > 70 ? '高' : 
                  summary.precipitation.probability > 40 ? '中' : '低'
                }
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${
                summary.windSpeed.avgValue > 25 ? 'bg-red-500' : 
                summary.windSpeed.avgValue > 15 ? 'bg-yellow-500' : 'bg-green-500'
              }`}></div>
              <span className="text-sm">
                風速風險: {
                  summary.windSpeed.avgValue > 25 ? '高' : 
                  summary.windSpeed.avgValue > 15 ? '中' : '低'
                }
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${
                summary.humidity.avgValue > 85 ? 'bg-red-500' : 
                summary.humidity.avgValue > 70 ? 'bg-yellow-500' : 'bg-green-500'
              }`}></div>
              <span className="text-sm">
                濕度風險: {
                  summary.humidity.avgValue > 85 ? '高' : 
                  summary.humidity.avgValue > 70 ? '中' : '低'
                }
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${
                summary.weatherType.type === '炎熱' || summary.weatherType.type === '悶熱' ? 'bg-red-500' : 
                summary.weatherType.type === '潮濕' || summary.weatherType.type === '強風' ? 'bg-yellow-500' : 'bg-green-500'
              }`}></div>
              <span className="text-sm">
                舒適度風險: {
                  summary.weatherType.type === '炎熱' || summary.weatherType.type === '悶熱' ? '高' : 
                  summary.weatherType.type === '潮濕' || summary.weatherType.type === '強風' ? '中' : '低'
                }
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisDashboard;
