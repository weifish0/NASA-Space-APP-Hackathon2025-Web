import React, { useState, useEffect } from 'react';
import LocationSelector from './components/LocationSelector';
import AnalysisDashboard from './components/AnalysisDashboard';
import type { Location, WeatherApiResponse } from './types';
import { fetchWeatherData, weatherApi } from './services/api';
import './utils/browserTest'; // 導入瀏覽器兼容性測試
import './utils/apiTest'; // 導入 API 連接測試
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { motion, AnimatePresence } from 'framer-motion';


const App: React.FC = () => {
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [weatherData, setWeatherData] = useState<WeatherApiResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMapFixed, setIsMapFixed] = useState(false);
  const [apiStatus, setApiStatus] = useState<'checking' | 'connected' | 'error'>('checking');
  const [trendYears, setTrendYears] = useState<number>(20);

  // 設置默認日期為今天
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setStartDate(today);
    setEndDate(today);
  }, []);

  // 檢查 API 連接狀態
  useEffect(() => {
    const checkApiStatus = async () => {
      try {
        await weatherApi.checkHealth();
        setApiStatus('connected');
      } catch (error) {
        setApiStatus('error');
        console.error('API connection failed:', error);
      }
    };

    checkApiStatus();
  }, []);

  // 處理位置選擇
  const handleLocationSelect = (location: Location) => {
    setSelectedLocation(location);
    setError(null);
  };

  // 處理開始日期選擇
  const handleStartDateSelect = (date: string) => {
    setStartDate(date);
    setError(null);
  };

  // 處理結束日期選擇
  const handleEndDateSelect = (date: string) => {
    setEndDate(date);
    setError(null);
  };

  // 處理地圖固定狀態變化
  const handleMapFixedChange = (fixed: boolean) => {
    setIsMapFixed(fixed);
  };

  // 獲取天氣數據
  const fetchData = async () => {
    if (!selectedLocation || !startDate) {
      setError('請選擇地點和開始日期');
      return;
    }

    // 驗證日期範圍
    if (endDate && new Date(startDate) > new Date(endDate)) {
      setError('開始日期不能晚於結束日期');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await fetchWeatherData(selectedLocation, startDate, endDate || undefined, trendYears);
      setWeatherData(data);
    } catch (err) {
      let errorMessage = '獲取天氣數據時發生錯誤，請稍後再試';
      
      if (err instanceof Error) {
        // 檢查是否為 API 錯誤
        if ((err as any).status === 400) {
          errorMessage = '請求參數錯誤，請檢查位置和日期';
        } else if ((err as any).status === 422) {
          errorMessage = '數據驗證錯誤，請檢查輸入格式';
        } else if ((err as any).status === 500) {
          errorMessage = '服務器內部錯誤，請稍後再試';
        } else if ((err as any).status === 502) {
          errorMessage = 'NASA Power API 服務暫時不可用';
        } else if (err.message) {
          errorMessage = err.message;
        }
      }
      
      setError(errorMessage);
      console.error('Error fetching weather data:', err);
    } finally {
      setLoading(false);
    }
  };

  // 當位置或日期改變時自動獲取數據
  useEffect(() => {
    if (selectedLocation && startDate) {
      fetchData();
    }
  }, [selectedLocation, startDate, endDate]);

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
            onStartDateSelect={handleStartDateSelect}
            onEndDateSelect={handleEndDateSelect}
            selectedLocation={selectedLocation || undefined}
            startDate={startDate}
            endDate={endDate}
            onMapFixedChange={handleMapFixedChange}
            onTrendYearsChange={setTrendYears}
            trendYears={trendYears}
          />
        </div>

        {/* 載入狀態 */}
        <AnimatePresence>
          {loading && (
            <motion.div
              key="loading-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-md bg-white/30"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                className="rounded-2xl bg-white/70 shadow-2xl p-10 flex flex-col items-center text-center space-y-5 w-[360px] border border-white/40"
              >
                {/* ✅ Lottie Animation */}
                <DotLottieReact
                  src="https://lottie.host/96252d88-e7d1-4469-87b6-1108d06adfcf/ENEvYo8zvt.lottie"
                  loop
                  autoplay
                  style={{ width: 300, height: 300 }}
                />

                {/* ✅ Loading Text */}
                <div className="flex flex-col">
                  <span className="text-lg font-semibold text-gray-800 tracking-wide">
                    正在分析天氣數據...
                  </span>
                  <span className="text-sm text-gray-600">
                    從 NASA Power API 獲取歷史數據
                  </span>
                </div>

                {/* ✅ 小進度條動畫 */}
                <div className="w-3/4 h-1.5 bg-gray-200 rounded-full overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 animate-loading-bar"></div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* API 狀態指示器 */}
        {apiStatus === 'checking' && (
          <div className="fixed top-4 left-4 bg-yellow-500 text-white px-4 py-2 rounded-lg shadow-lg z-50">
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>檢查 API 連接...</span>
            </div>
          </div>
        )}

        {apiStatus === 'error' && (
          <div className="fixed top-4 left-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg z-50">
            <div className="flex items-center gap-2">
              <span>⚠️</span>
              <span>API 連接失敗，請檢查後端服務</span>
            </div>
          </div>
        )}

        {apiStatus === 'connected' && (
          <div className="fixed top-4 left-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50">
            <div className="flex items-center gap-2">
              <span>✅</span>
              <span>API 連接正常</span>
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
        {!weatherData && !loading && selectedLocation && startDate && (
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
