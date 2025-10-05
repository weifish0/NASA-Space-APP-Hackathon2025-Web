import React, { useState, useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Chart as ReactChart } from 'react-chartjs-2';
import type { TrendDataPoint, ChartData } from '../types';
import GlassCard from './GlassCard';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface TrendChartProps {
  data: TrendDataPoint[];
}

type ChartType = 'temperature' | 'precipitation' | 'wind';

const TrendChart: React.FC<TrendChartProps> = ({ data }) => {
  const [selectedChart, setSelectedChart] = useState<ChartType>('temperature');

  // --- Chart Data ---
  const chartData: ChartData = useMemo(() => {
    const labels = data.map((item) => item.year.toString());
    let dataset: number[] = [];
    let label = '';
    let borderColor = '';
    let backgroundColor = '';

    switch (selectedChart) {
      case 'temperature':
        dataset = data.map((item) => item.maxTemperature);
        label = 'Maximum Temperature (°C)';
        borderColor = 'rgb(239, 68, 68)';
        backgroundColor = 'rgba(239, 68, 68, 0.15)';
        break;
      case 'precipitation':
        dataset = data.map((item) => item.precipitation);
        label = 'Precipitation (mm)';
        borderColor = 'rgb(59, 130, 246)';
        backgroundColor = 'rgba(59, 130, 246, 0.15)';
        break;
      case 'wind':
        dataset = data.map((item) => item.windSpeed);
        label = 'Average Wind Speed (km/h)';
        borderColor = 'rgb(34, 197, 94)';
        backgroundColor = 'rgba(34, 197, 94, 0.15)';
        break;
    }

    return {
      labels,
      datasets: [
        {
          label,
          data: dataset,
          borderColor,
          backgroundColor,
          tension: 0.35,
          pointBackgroundColor: borderColor,
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6,
        },
      ],
    };
  }, [data, selectedChart]);

  // --- Chart Options ---
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: '#333',
          font: { weight: 'bold' as const },
        },
      },
      title: {
        display: true,
        text: `Past ${data.length} years ${getChartTitle(selectedChart)} trend`,
        color: '#222',
        font: { size: 16, weight: 'bold' as const },
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
        backgroundColor: 'rgba(30,30,30,0.9)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: 'rgba(255,255,255,0.3)',
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        ticks: { color: '#333' },
        title: { display: true, text: 'Year', color: '#333' },
        grid: { color: 'rgba(0,0,0,0.1)' },
      },
      y: {
        ticks: { color: '#333' },
        title: { display: true, text: getYAxisLabel(selectedChart), color: '#333' },
        grid: { color: 'rgba(0,0,0,0.1)' },
      },
    },
  };

  // --- CSV Download ---
  const downloadCSV = () => {
    const csvContent = generateCSV(data, selectedChart);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${getChartTitle(selectedChart)}_trend_data.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <GlassCard className="p-6 text-gray-800">
      {/* Header */}
      <h3 className="text-xl font-bold mb-4 text-gray-900 drop-shadow-[0_1px_2px_rgba(255,255,255,0.7)]">
        Historical Trend Analysis
      </h3>

      {/* Chart Type Selector */}
      <div className="flex flex-wrap gap-2 mb-6">
        {[
          { type: 'temperature', label: '🌡️ Temperature', color: 'red' },
          { type: 'precipitation', label: '🌧️ Precipitation', color: 'blue' },
          { type: 'wind', label: '💨 Wind Speed', color: 'green' },
        ].map((btn) => (
          <button
            key={btn.type}
            onClick={() => setSelectedChart(btn.type as ChartType)}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              selectedChart === btn.type
                ? `bg-${btn.color}-500 text-white shadow-lg shadow-${btn.color}-300/40`
                : 'bg-white/20 text-gray-900 hover:bg-white/40'
            }`}
          >
            {btn.label}
          </button>
        ))}
      </div>

      {/* Chart */}
      <div className="relative h-96 mb-4">
        <ReactChart type='line' data={chartData} options={options} />
      </div>

      {/* Download Button */}
      <div className="flex justify-end">
        <button
          onClick={downloadCSV}
          className="px-6 py-2 bg-blue-500/80 text-white rounded-lg hover:bg-blue-600 transition-all shadow-md shadow-blue-300/40 flex items-center gap-2"
        >
          📥 Download CSV
        </button>
      </div>
    </GlassCard>
  );
};

export default TrendChart;

// --- Helper Functions ---
const getChartTitle = (type: ChartType): string => {
  switch (type) {
    case 'temperature': return 'Temperature';
    case 'precipitation': return 'Precipitation';
    case 'wind': return 'Wind Speed';
    default: return 'Temperature';
  }
};

const getYAxisLabel = (type: ChartType): string => {
  switch (type) {
    case 'temperature': return 'Temperature (°C)';
    case 'precipitation': return 'Precipitation (mm)';
    case 'wind': return 'Wind Speed (km/h)';
    default: return 'Temperature (°C)';
  }
};

const generateCSV = (data: TrendDataPoint[], type: ChartType): string => {
  const headers = ['Year', getYAxisLabel(type)];
  const rows = data.map(item => {
    let value = 0;
    if (type === 'temperature') value = item.maxTemperature;
    else if (type === 'precipitation') value = item.precipitation;
    else if (type === 'wind') value = item.windSpeed;
    return [item.year, value];
  });
  return [headers, ...rows].map(r => r.join(',')).join('\n');
};