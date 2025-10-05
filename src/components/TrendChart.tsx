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
// @ts-ignore
import { Line } from 'react-chartjs-2';
import type { TrendDataPoint, ChartData } from '../types';

// 註冊 Chart.js 組件
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface TrendChartProps {
  data: TrendDataPoint[];
}

type ChartType = 'temperature' | 'precipitation' | 'wind';

const TrendChart: React.FC<TrendChartProps> = ({ data }) => {
  const [selectedChart, setSelectedChart] = useState<ChartType>('temperature');

  // 生成圖表數據
  const chartData: ChartData = useMemo(() => {
    const labels = data.map(item => item.year.toString());
    
    let dataset;
    let label;
    let borderColor;
    let backgroundColor;

    switch (selectedChart) {
      case 'temperature':
        dataset = data.map(item => item.maxTemperature);
        label = '最高溫度 (°C)';
        borderColor = 'rgb(239, 68, 68)';
        backgroundColor = 'rgba(239, 68, 68, 0.1)';
        break;
      case 'precipitation':
        dataset = data.map(item => item.precipitation);
        label = '降雨量 (mm)';
        borderColor = 'rgb(59, 130, 246)';
        backgroundColor = 'rgba(59, 130, 246, 0.1)';
        break;
      case 'wind':
        dataset = data.map(item => item.windSpeed);
        label = '平均風速 (km/h)';
        borderColor = 'rgb(34, 197, 94)';
        backgroundColor = 'rgba(34, 197, 94, 0.1)';
        break;
      default:
        dataset = data.map(item => item.maxTemperature);
        label = '最高溫度 (°C)';
        borderColor = 'rgb(239, 68, 68)';
        backgroundColor = 'rgba(239, 68, 68, 0.1)';
    }

    return {
      labels,
      datasets: [
        {
          label,
          data: dataset,
          borderColor,
          backgroundColor,
          tension: 0.4,
          pointBackgroundColor: borderColor,
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6,
        },
      ],
    };
  }, [data, selectedChart]);

  // 圖表選項
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: `過去${data.length}年${getChartTitle(selectedChart)}趨勢`,
        font: {
          size: 16,
          weight: 'bold' as const,
        },
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: '年份',
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
      },
      y: {
        display: true,
        title: {
          display: true,
          text: getYAxisLabel(selectedChart),
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
      },
    },
    interaction: {
      mode: 'nearest' as const,
      axis: 'x' as const,
      intersect: false,
    },
  };

  // 下載 CSV 功能
  const downloadCSV = () => {
    const csvContent = generateCSV(data, selectedChart);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${getChartTitle(selectedChart)}_趨勢數據.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* 圖表類型選擇器 */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setSelectedChart('temperature')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            selectedChart === 'temperature'
              ? 'bg-red-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          🌡️ 溫度趨勢
        </button>
        <button
          onClick={() => setSelectedChart('precipitation')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            selectedChart === 'precipitation'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          🌧️ 降雨趨勢
        </button>
        <button
          onClick={() => setSelectedChart('wind')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            selectedChart === 'wind'
              ? 'bg-green-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          💨 風速趨勢
        </button>
      </div>

      {/* 圖表容器 */}
      <div className="relative h-96 mb-4">
        <Line data={chartData} options={options} />
      </div>

      {/* 下載按鈕 */}
      <div className="flex justify-end">
        <button
          onClick={downloadCSV}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
        >
          📥 下載 CSV
        </button>
      </div>
    </div>
  );
};

// 輔助函數
const getChartTitle = (type: ChartType): string => {
  switch (type) {
    case 'temperature':
      return '溫度';
    case 'precipitation':
      return '降雨';
    case 'wind':
      return '風速';
    default:
      return '溫度';
  }
};

const getYAxisLabel = (type: ChartType): string => {
  switch (type) {
    case 'temperature':
      return '溫度 (°C)';
    case 'precipitation':
      return '降雨量 (mm)';
    case 'wind':
      return '風速 (km/h)';
    default:
      return '溫度 (°C)';
  }
};

const generateCSV = (data: TrendDataPoint[], type: ChartType): string => {
  const headers = ['年份', getYAxisLabel(type)];
  const rows = data.map(item => {
    let value;
    switch (type) {
      case 'temperature':
        value = item.maxTemperature;
        break;
      case 'precipitation':
        value = item.precipitation;
        break;
      case 'wind':
        value = item.windSpeed;
        break;
      default:
        value = item.maxTemperature;
    }
    return [item.year, value];
  });

  return [headers, ...rows]
    .map(row => row.join(','))
    .join('\n');
};

export default TrendChart;
