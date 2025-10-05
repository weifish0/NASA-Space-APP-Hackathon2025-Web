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
  const weatherType = summary.weatherType?.type || "Comfortable";

  // ✅ 動態背景影片對應表
  const weatherVideoMap: Record<string, string> = {
    Hot: "/videos/weather/hot.mp4",
    Cold: "/videos/weather/cold.mp4",
    Humid: "/videos/weather/humid.mp4",
    Windy: "/videos/weather/windy.mp4",
    Muggy: "/videos/weather/muggy.mp4",
    Comfortable: "/videos/weather/comfortable.mp4",
  };

  const videoSrc = weatherVideoMap[weatherType] || weatherVideoMap["Comfortable"];

  return (
    <div className="relative min-h-screen overflow-hidden text-yellow-50">
  {/* 🎬 背景影片 */}
  <video
    key={videoSrc}
    src={videoSrc}
    autoPlay
    loop
    muted
    playsInline
    className="absolute inset-0 w-full h-full object-cover z-0"
  />

  {/* 🌫️ 亮色透明遮罩 */}
  <div className="absolute inset-0 bg-white/10 backdrop-blur-2xl z-10" />

  {/* 🌕 主內容 */}
  <div className="relative z-20 w-full max-w-7xl mx-auto p-6 space-y-8">
    <div className="text-center mb-8">
      <h2 className="text-3xl font-bold text-yellow-100 mb-2 drop-shadow-[0_0_10px_rgba(255,255,180,0.8)]">
        Weather Risk Analysis Report
      </h2>
      <p className="text-lg text-yellow-200/90">
        Location: ({weatherData.location.lat.toFixed(2)}, {weatherData.location.lon.toFixed(2)}) – Based on historical average data
      </p>
    </div>

    <WeatherTypeCard weatherSummary={summary} />

    {/* 📊 各項卡片 */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <ProbabilityCard
        title="Average Temperature"
        value={`${summary.avgTemperature.avgValue}${summary.avgTemperature.unit}`}
        probability={`${Math.round((summary.avgTemperature.avgValue / 40) * 100)}%`}
        icon="🌡️"
      />
      <ProbabilityCard
        title="Maximum Temperature"
        value={`${summary.maxTemperature.avgValue}${summary.maxTemperature.unit}`}
        probability={`${Math.round((summary.maxTemperature.avgValue / 40) * 100)}%`}
        icon="🔥"
      />
      <ProbabilityCard
        title="Precipitation Probability"
        value={`${summary.precipitation.probability}${summary.precipitation.unit}`}
        probability={`${summary.precipitation.probability}%`}
        icon="🌧️"
      />
      <ProbabilityCard
        title="Average Wind Speed"
        value={`${summary.windSpeed.avgValue}${summary.windSpeed.unit}`}
        probability={`${Math.round((summary.windSpeed.avgValue / 30) * 100)}%`}
        icon="💨"
      />
    </div>

    {/* 趨勢圖表區 */}
    <div className="bg-white/10 backdrop-blur-2xl border border-yellow-100/40 rounded-2xl p-6 shadow-[0_8px_30px_rgba(255,255,200,0.2)]">
      <h3 className="text-xl font-semibold text-yellow-50 mb-4 drop-shadow-[0_0_6px_rgba(255,255,200,0.5)]">
        Historical Trend Analysis
      </h3>
      <TrendChart data={trendData} />
    </div>
  

        {/* Data summary area */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Data summary */}
          <div className="bg-[#1a1a1a]/70 backdrop-blur-lg rounded-2xl p-6 border border-yellow-200/20 shadow-[0_8px_30px_rgba(255,255,150,0.1)]">
            <h4 className="text-lg font-semibold text-yellow-100 mb-4">
              📊 Data Summary
            </h4>
            <div className="space-y-3 text-yellow-200">
              <div className="flex justify-between">
                <span>Analysis Period:</span>
                <span>
                  {Math.min(...trendData.map(d => d.year))} - {Math.max(...trendData.map(d => d.year))}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Data Points:</span>
                <span>{trendData.length} years</span>
              </div>
              <div className="flex justify-between">
                <span>Average Temperature Range:</span>
                <span>
                  {Math.min(...trendData.map(d => d.avgTemperature)).toFixed(1)}°C - {Math.max(...trendData.map(d => d.avgTemperature)).toFixed(1)}°C
                </span>
              </div>
              <div className="flex justify-between">
                <span>Maximum Temperature Range:</span>
                <span>
                  {Math.min(...trendData.map(d => d.maxTemperature)).toFixed(1)}°C - {Math.max(...trendData.map(d => d.maxTemperature)).toFixed(1)}°C
                </span>
              </div>
              <div className="flex justify-between">
                <span>Wind Speed Range:</span>
                <span>
                  {Math.min(...trendData.map(d => d.windSpeed)).toFixed(1)} - {Math.max(...trendData.map(d => d.windSpeed)).toFixed(1)} km/h
                </span>
              </div>
              <div className="flex justify-between">
                <span>Humidity Range:</span>
                <span>
                  {Math.min(...trendData.map(d => d.humidity)).toFixed(1)}% - {Math.max(...trendData.map(d => d.humidity)).toFixed(1)}%
                </span>
              </div>
            </div>
          </div>

          {/* Risk Assessment */}
          <div className="bg-[#1a1a1a]/70 backdrop-blur-lg rounded-2xl p-6 border border-yellow-200/20 shadow-[0_8px_30px_rgba(255,255,150,0.1)]">
            <h4 className="text-lg font-semibold text-yellow-100 mb-4">
              🔍 Risk Assessment
            </h4>
            <div className="space-y-3 text-yellow-200">
              <RiskItem label="High Temperature" value={summary.maxTemperature.avgValue} high={35} medium={30} unit="°C" />
              <RiskItem label="Precipitation" value={summary.precipitation.probability} high={70} medium={40} unit="%" />
              <RiskItem label="Wind Speed" value={summary.windSpeed.avgValue} high={25} medium={15} unit="km/h" />
              <RiskItem label="Humidity" value={summary.humidity.avgValue} high={85} medium={70} unit="%" />
              <RiskItem label="Comfort Level" customType={summary.weatherType.type} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisDashboard;

// 🔧 小組件：風險顯示項
const RiskItem = ({
  label,
  value,
  high,
  medium,
  unit,
  customType,
}: {
  label: string;
  value?: number;
  high?: number;
  medium?: number;
  unit?: string;
  customType?: string;
}) => {
  let color = "bg-green-500";
  let risk = "Low";

  if (customType) {
    if (["Hot", "Muggy"].includes(customType)) {
      color = "bg-red-500";
      risk = "High";
    } else if (["Humid", "Windy"].includes(customType)) {
      color = "bg-yellow-500";
      risk = "Medium";
    }
  } else if (value !== undefined && high !== undefined && medium !== undefined) {
    if (value > high) {
      color = "bg-red-500";
      risk = "High";
    } else if (value > medium) {
      color = "bg-yellow-500";
      risk = "Medium";
    }
  }

  return (
    <div className="flex items-center gap-2">
      <div className={`w-3 h-3 rounded-full ${color}`} />
      <span className="text-sm">{`${label} Risk: ${risk}${value ? ` (${value}${unit || ''})` : ''}`}</span>
    </div>
  );
};