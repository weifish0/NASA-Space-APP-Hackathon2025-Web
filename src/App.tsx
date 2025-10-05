import React, { useState, useEffect } from 'react';
import LocationSelector from './components/LocationSelector';
import AnalysisDashboard from './components/AnalysisDashboard';
import FloatingWeatherAssistant from './components/FloatingWeatherAssistant';
import ApiStatusIndicator from './components/ApiStatusIndicator';
import type { Location, WeatherApiResponse } from './types';
import { fetchWeatherData, weatherApi } from './services/api';
import './utils/browserTest'; // Import browser compatibility test
import './utils/apiTest'; // Import API connection test
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
  const [trendYears, setTrendYears] = useState<number>(5);

  // Set default date to today
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setStartDate(today);
    setEndDate(today);
  }, []);

  // Check API connection status
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

  // Handle location selection
  const handleLocationSelect = (location: Location) => {
    setSelectedLocation(location);
    setError(null);
  };

  // Handle start date selection
  const handleStartDateSelect = (date: string) => {
    setStartDate(date);
    setError(null);
  };

  // Handle end date selection
  const handleEndDateSelect = (date: string) => {
    setEndDate(date);
    setError(null);
  };

  // Handle map fixed state change
  const handleMapFixedChange = (fixed: boolean) => {
    setIsMapFixed(fixed);
  };

  // Fetch weather data
  const fetchData = async () => {
    if (!selectedLocation || !startDate) {
      setError('Please select location and start date');
      return;
    }

    // Validate date range
    if (endDate && new Date(startDate) > new Date(endDate)) {
      setError('Start date cannot be later than end date');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await fetchWeatherData(selectedLocation, startDate, endDate || undefined, trendYears);
      setWeatherData(data);
    } catch (err) {
      let errorMessage = 'Error occurred while fetching weather data, please try again later';
      
      if (err instanceof Error) {
        // Check if it is an API error
        if ((err as any).status === 400) {
          errorMessage = 'Request parameter error, please check location and date';
        } else if ((err as any).status === 422) {
          errorMessage = 'Data validation error, please check input format';
        } else if ((err as any).status === 500) {
          errorMessage = 'Internal server error, please try again later';
        } else if ((err as any).status === 502) {
          errorMessage = 'NASA Power API service temporarily unavailable';
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

  // Automatically fetch data when location or date changes
  useEffect(() => {
    if (selectedLocation && startDate) {
      fetchData();
    }
  }, [selectedLocation, startDate, endDate]);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Title area */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                🌍 Event Horizon Weather
              </h1>
              <p className="text-gray-600 mt-2">
                Weather Risk Analysis Platform - Intelligent Prediction Based on Historical Data
              </p>
            </div>
            <ApiStatusIndicator />
          </div>
        </div>
      </header>

      {/* Main content area */}
      <main className={`relative min-h-screen bg-gray-50 ${isMapFixed ? 'pb-96' : ''}`}>
        {/* Location selector */}
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

<<<<<<< HEAD
        {/* 載入狀態 */}
        {loading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 flex items-center gap-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <div className="flex flex-col">
                <span className="text-lg font-medium">正在分析天氣數據...</span>
                <span className="text-sm text-gray-500">從 NASA Power API 獲取歷史數據</span>
              </div>
            </div>
          </div>
        )}
=======
        {/* Loading state */}
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
                    Analyzing weather data...
                  </span>
                  <span className="text-sm text-gray-600">
                    Fetching historical data from NASA Power API
                  </span>
                </div>

                {/* ✅ Small progress bar animation */}
                <div className="w-3/4 h-1.5 bg-gray-200 rounded-full overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 animate-loading-bar"></div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
>>>>>>> 8319687 (feat: LLM Chatbot)

        {/* API status indicator */}
        {apiStatus === 'checking' && (
          <div className="fixed top-4 left-4 bg-yellow-500 text-white px-4 py-2 rounded-lg shadow-lg z-50">
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Checking API connection...</span>
            </div>
          </div>
        )}

        {apiStatus === 'error' && (
          <div className="fixed top-4 left-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg z-50">
            <div className="flex items-center gap-2">
              <span>⚠️</span>
              <span>API connection failed, please check backend service</span>
            </div>
          </div>
        )}

        {apiStatus === 'connected' && (
          <div className="fixed top-4 left-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50">
            <div className="flex items-center gap-2">
              <span>✅</span>
              <span>API connection normal</span>
            </div>
          </div>
        )}

        {/* Error message */}
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

        {/* Analysis dashboard */}
        {weatherData && !loading && (
          <div className="fixed inset-0 bg-white z-40 overflow-y-auto">
            <div className="relative">
              {/* Close button */}
              <button
                onClick={() => setWeatherData(null)}
                className="fixed top-4 right-4 z-50 bg-gray-800 text-white p-2 rounded-full hover:bg-gray-700 transition-colors"
                title="Close analysis results"
              >
                ✕
              </button>
              
              {/* Analysis results */}
              <AnalysisDashboard weatherData={weatherData} />
            </div>
          </div>
        )}

        {/* Empty state prompt */}
        {!weatherData && !loading && selectedLocation && startDate && (
          <div className="max-w-7xl mx-auto px-6 pb-8">
            <div className="bg-blue-500 text-white px-6 py-4 rounded-lg shadow-lg">
              <div className="flex items-center gap-2">
                <span>📍</span>
                <span>Location and date selected, analyzing...</span>
              </div>
            </div>
          </div>
        )}

        {/* Initial prompt */}
        {!selectedLocation && (
          <div className="max-w-7xl mx-auto px-6 pb-8">
            <div className="bg-gray-800 text-white px-6 py-4 rounded-lg shadow-lg">
              <div className="flex items-center gap-2">
                <span>👆</span>
                <span>Please click on the map or search to select a location</span>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Floating Weather Assistant */}
      <FloatingWeatherAssistant 
        selectedLocation={selectedLocation || undefined}
        weatherData={weatherData || undefined}
      />

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-400">
            Event Horizon Weather - NASA Space App Challenge 2025
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Intelligent risk analysis platform based on historical weather data
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
