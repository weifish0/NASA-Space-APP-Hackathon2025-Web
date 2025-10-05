import React, { useState, useEffect, useRef } from 'react';
import LocationSelector from './components/LocationSelector';
import AnalysisDashboard from './components/AnalysisDashboard';
import FloatingWeatherAssistant from './components/FloatingWeatherAssistant';
import type { Location, WeatherApiResponse } from './types';
import { fetchWeatherData } from './services/api';
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
  const [_isMapFixed, setIsMapFixed] = useState(false);
  const [isNavHidden, setIsNavHidden] = useState(false);
  const lastScrollYRef = useRef(0);
  useEffect(() => {
    const THRESHOLD = 4; // px
    const handleScroll = () => {
      const currentY = window.scrollY || window.pageYOffset;
      const delta = currentY - lastScrollYRef.current;
      if (currentY > 40 && delta > THRESHOLD) {
        setIsNavHidden(true);
      } else if (delta < -THRESHOLD || currentY <= 40) {
        setIsNavHidden(false);
      }
      lastScrollYRef.current = currentY;
    };
    // 初始同步一次，避免載入時位置不在頂部
    lastScrollYRef.current = window.scrollY || window.pageYOffset;
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  const [trendYears, setTrendYears] = useState<number>(5);

  // Set default date to today
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setStartDate(today);
    setEndDate(today);
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
    <div className="min-h-screen relative bg-hero-gradient">
      {/* Subtle noise overlay */}
      <div className="noise-overlay fixed inset-0 z-0"></div>
      {/* Title area */}
      <header className={`glass-header sticky top-0 z-10 transition-transform duration-300 will-change-transform ${isNavHidden ? '-translate-y-full' : 'translate-y-0'} transform`}>
        <div className={`max-w-8xl mx-auto px-4 py-1 transition-all duration-300`}>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <a href="/" className="block" title="Go to homepage">
                <img src="/logo.svg" alt="Logo" className={`h-[65px] w-auto transition-all duration-300`} />
              </a>
              <div>
                <h1 className="text-3xl font-extrabold gradient-text tracking-tight">
                  Event Horizon Weather
                </h1>
                <p className="text-gray-700 mt-1 text-sm">
                  AI-Driven Risk Assessment for Your Perfect Day
                </p>
              </div>
            </div>
            {/* API status indicator removed */}
          </div>
        </div>
      </header>

      {/* Main content area */}
      <main className={`relative min-h-screen ${weatherData ? "overflow-hidden" : ""}`}>
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

        {/* API status indicator removed */}

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
          <AnimatePresence>
            <motion.div
              key="dashboard"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="fixed inset-0 z-50 bg-black/90 backdrop-blur-lg overflow-y-auto"
            >
              {/* 關閉按鈕 */}
              <button
                onClick={() => setWeatherData(null)}
                className="absolute top-6 right-6 bg-yellow-300/20 border border-yellow-200/30 hover:bg-yellow-300/30 text-yellow-100 p-2 rounded-full z-50 transition-all"
              >
                ✕
              </button>

              {/* Dashboard 內容 */}
              <div className="relative z-40">
                <AnalysisDashboard weatherData={weatherData} />
              </div>
            </motion.div>
          </AnimatePresence>
        )}

        {/* Empty state prompt */}
        {!weatherData && !loading && selectedLocation && startDate && (
          <div className="max-w-7xl mx-auto px-6 pb-8">
            <div className="glass-card px-6 py-4 rounded-xl">
              <div className="flex items-center gap-2">
                <span>📍</span>
                <span className="text-gray-800">Location and date selected, analyzing...</span>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* Floating Weather Assistant - only show on analysis page */}
      {weatherData && (
        <FloatingWeatherAssistant 
          selectedLocation={selectedLocation || undefined}
          weatherData={weatherData || undefined}
        />
      )}

      {/* Footer */}
      <footer className="mt-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="glass-card rounded-2xl p-6 text-center">
            <p className="text-gray-700">
              Event Horizon Weather - NASA Space App Challenge 2025
            </p>
            <p className="text-sm text-gray-500 mt-1">
              made by Will Cheng and David Chung
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
