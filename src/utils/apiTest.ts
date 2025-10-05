// API connection testing tool
import { weatherApi } from '../services/api';

export const testApiConnection = async (): Promise<{
  success: boolean;
  message: string;
  details: any;
}> => {
  console.log('🔍 Starting API connection test...');
  
  try {
    // Test health check
    console.log('1️⃣ Testing API health check...');
    const health = await weatherApi.checkHealth();
    console.log('✅ API health check passed:', health);
    
    // Test NASA Power API
    console.log('2️⃣ Testing NASA Power API...');
    const nasaTest = await weatherApi.testNasaApi();
    console.log('✅ NASA Power API test passed:', nasaTest);
    
    // Test weather analysis (using Taipei as test)
    console.log('3️⃣ Testing weather analysis...');
    const weatherData = await weatherApi.getWeatherAnalysis({
      lat: 25.0330,
      lon: 121.5654,
      start_date: '20240115',
      years: 3
    });
    console.log('✅ Weather analysis test passed:', weatherData);
    
    return {
      success: true,
      message: 'All API tests passed',
      details: {
        health,
        nasaTest,
        weatherData: {
          location: weatherData.location,
          summary: weatherData.summary,
          trendDataLength: weatherData.trendData.length
        }
      }
    };
  } catch (error) {
    console.error('❌ API test failed:', error);
    return {
      success: false,
      message: `API test failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      details: { error }
    };
  }
};

// Automatically run tests in development environment (disabled to reduce load)
if (import.meta.env.DEV && false) { // Disabled to prevent API overload
  setTimeout(() => {
    testApiConnection();
  }, 2000);
}
