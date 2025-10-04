import React, { useState, useEffect } from 'react';
import LocationSelector from './components/LocationSelector';
import AnalysisDashboard from './components/AnalysisDashboard';
import type { Location, WeatherApiResponse } from './types';
import { fetchWeatherData } from './data/mockData';

const App: React.FC = () => {
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [weatherData, setWeatherData] = useState<WeatherApiResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMapFixed, setIsMapFixed] = useState(false);

  // 設置默認日期為今天
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setSelectedDate(today);
  }, []);

  // 處理位置選擇
  const handleLocationSelect = (location: Location) => {
    setSelectedLocation(location);
    setError(null);
  };

  // 處理日期選擇
  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setError(null);
  };

  // 處理地圖固定狀態變化
  const handleMapFixedChange = (fixed: boolean) => {
    setIsMapFixed(fixed);
  };

  // 獲取天氣數據
  const fetchData = async () => {
    if (!selectedLocation || !selectedDate) {
      setError('請選擇地點和日期');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await fetchWeatherData(selectedLocation, selectedDate);
      setWeatherData(data);
    } catch (err) {
      setError('獲取天氣數據時發生錯誤，請稍後再試');
      console.error('Error fetching weather data:', err);
    } finally {
      setLoading(false);
    }
  };

  // 當位置或日期改變時自動獲取數據
  useEffect(() => {
    if (selectedLocation && selectedDate) {
      fetchData();
    }
  }, [selectedLocation, selectedDate]);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* 標題區域 */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900 text-center">
            🌍 Event Horizon Weather
          </h1>
          <p className="text-center text-gray-600 mt-2">
            天氣風險分析平台 - 基於歷史數據的智能預測
          </p>
        </div>
      </header>

      {/* 主要內容區域 */}
      <main className={`relative min-h-screen bg-gray-50 ${isMapFixed ? 'pb-96' : ''}`}>
        {/* 位置選擇器 */}
        <div className="py-8">
          <LocationSelector
            onLocationSelect={handleLocationSelect}
            onDateSelect={handleDateSelect}
            selectedLocation={selectedLocation || undefined}
            selectedDate={selectedDate}
            onMapFixedChange={handleMapFixedChange}
          />
        </div>

        {/* 載入狀態 */}
        {loading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 flex items-center gap-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <span className="text-lg font-medium">正在分析天氣數據...</span>
            </div>
          </div>
        )}

        {/* 錯誤訊息 */}
        {error && (
          <div className="fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50">
            <div className="flex items-center gap-2">
              <span>⚠️</span>
              <span>{error}</span>
              <button
                onClick={() => setError(null)}
                className="ml-2 text-white hover:text-gray-200"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* 分析儀表板 */}
        {weatherData && !loading && (
          <div className="fixed inset-0 bg-white z-40 overflow-y-auto">
            <div className="relative">
              {/* 關閉按鈕 */}
              <button
                onClick={() => setWeatherData(null)}
                className="fixed top-4 right-4 z-50 bg-gray-800 text-white p-2 rounded-full hover:bg-gray-700 transition-colors"
                title="關閉分析結果"
              >
                ✕
              </button>
              
              {/* 分析結果 */}
              <AnalysisDashboard weatherData={weatherData} />
            </div>
          </div>
        )}

        {/* 空狀態提示 */}
        {!weatherData && !loading && selectedLocation && selectedDate && (
          <div className="max-w-7xl mx-auto px-6 pb-8">
            <div className="bg-blue-500 text-white px-6 py-4 rounded-lg shadow-lg">
              <div className="flex items-center gap-2">
                <span>📍</span>
                <span>已選擇位置和日期，正在分析中...</span>
              </div>
            </div>
          </div>
        )}

        {/* 初始提示 */}
        {!selectedLocation && (
          <div className="max-w-7xl mx-auto px-6 pb-8">
            <div className="bg-gray-800 text-white px-6 py-4 rounded-lg shadow-lg">
              <div className="flex items-center gap-2">
                <span>👆</span>
                <span>請點擊地圖或搜尋來選擇地點</span>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* 頁腳 */}
      <footer className="bg-gray-800 text-white py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-400">
            Event Horizon Weather - NASA Space App Challenge 2025
          </p>
          <p className="text-sm text-gray-500 mt-2">
            基於歷史天氣數據的智能風險分析平台
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
