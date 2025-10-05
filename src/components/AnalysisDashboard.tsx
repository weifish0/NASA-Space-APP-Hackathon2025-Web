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
      {/* Title area */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          Weather Risk Analysis Report
        </h2>
        <p className="text-lg text-gray-600">
          {weatherData.location.name} - Historical Weather Data Analysis
        </p>
      </div>

      {/* Weather type card */}
      <div className="mb-8">
        <WeatherTypeCard weatherSummary={summary} />
      </div>

      {/* Probability cards area */}
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
          probability={`${summary.precipitation.probability}% `}
          icon="🌧️"
        />
        <ProbabilityCard
          title="Average Wind Speed"
          value={`${summary.windSpeed.avgValue}${summary.windSpeed.unit}`}
          probability={`${Math.round((summary.windSpeed.avgValue / 30) * 100)}%`}
          icon="💨"
        />
      </div>

      {/* Additional data cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <ProbabilityCard
          title="Minimum Temperature"
          value={`${summary.minTemperature.avgValue}${summary.minTemperature.unit}`}
          probability={`${Math.round((summary.minTemperature.avgValue / 30) * 100)}%`}
          icon="❄️"
        />
        <ProbabilityCard
          title="Relative Humidity"
          value={`${summary.humidity.avgValue}${summary.humidity.unit}`}
          probability={`${Math.round((summary.humidity.avgValue / 100) * 100)}%`}
          icon="💧"
        />
      </div>

      {/* Trend chart area */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Historical Trend Analysis
        </h3>
        <TrendChart data={trendData} />
      </div>

      {/* Data summary area */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">
            📊 Data Summary
          </h4>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Analysis Period:</span>
              <span className="font-medium">
                {Math.min(...trendData.map(d => d.year))} - {Math.max(...trendData.map(d => d.year))}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Data Points:</span>
              <span className="font-medium">{trendData.length} years</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Average Temperature Range:</span>
              <span className="font-medium">
                {Math.min(...trendData.map(d => d.avgTemperature)).toFixed(1)}°C - {Math.max(...trendData.map(d => d.avgTemperature)).toFixed(1)}°C
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Maximum Temperature Range:</span>
              <span className="font-medium">
                {Math.min(...trendData.map(d => d.maxTemperature)).toFixed(1)}°C - {Math.max(...trendData.map(d => d.maxTemperature)).toFixed(1)}°C
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Wind Speed Range:</span>
              <span className="font-medium">
                {Math.min(...trendData.map(d => d.windSpeed)).toFixed(1)} - {Math.max(...trendData.map(d => d.windSpeed)).toFixed(1)} km/h
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Humidity Range:</span>
              <span className="font-medium">
                {Math.min(...trendData.map(d => d.humidity)).toFixed(1)}% - {Math.max(...trendData.map(d => d.humidity)).toFixed(1)}%
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">
            🔍 Risk Assessment
          </h4>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${
                summary.maxTemperature.avgValue > 35 ? 'bg-red-500' : 
                summary.maxTemperature.avgValue > 30 ? 'bg-yellow-500' : 'bg-green-500'
              }`}></div>
              <span className="text-sm">
                High Temperature Risk: {
                  summary.maxTemperature.avgValue > 35 ? 'High' : 
                  summary.maxTemperature.avgValue > 30 ? 'Medium' : 'Low'
                }
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${
                summary.precipitation.probability > 70 ? 'bg-red-500' : 
                summary.precipitation.probability > 40 ? 'bg-yellow-500' : 'bg-green-500'
              }`}></div>
              <span className="text-sm">
                Precipitation Risk: {
                  summary.precipitation.probability > 70 ? 'High' : 
                  summary.precipitation.probability > 40 ? 'Medium' : 'Low'
                }
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${
                summary.windSpeed.avgValue > 25 ? 'bg-red-500' : 
                summary.windSpeed.avgValue > 15 ? 'bg-yellow-500' : 'bg-green-500'
              }`}></div>
              <span className="text-sm">
                Wind Speed Risk: {
                  summary.windSpeed.avgValue > 25 ? 'High' : 
                  summary.windSpeed.avgValue > 15 ? 'Medium' : 'Low'
                }
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${
                summary.humidity.avgValue > 85 ? 'bg-red-500' : 
                summary.humidity.avgValue > 70 ? 'bg-yellow-500' : 'bg-green-500'
              }`}></div>
              <span className="text-sm">
                Humidity Risk: {
                  summary.humidity.avgValue > 85 ? 'High' : 
                  summary.humidity.avgValue > 70 ? 'Medium' : 'Low'
                }
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${
                summary.weatherType.type === 'Hot' || summary.weatherType.type === 'Muggy' ? 'bg-red-500' : 
                summary.weatherType.type === 'Humid' || summary.weatherType.type === 'Windy' ? 'bg-yellow-500' : 'bg-green-500'
              }`}></div>
              <span className="text-sm">
                Comfort Risk: {
                  summary.weatherType.type === 'Hot' || summary.weatherType.type === 'Muggy' ? 'High' : 
                  summary.weatherType.type === 'Humid' || summary.weatherType.type === 'Windy' ? 'Medium' : 'Low'
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
