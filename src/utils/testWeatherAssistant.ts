// Test Weather Assistant Integration
import { weatherAssistant } from '../services/weatherAssistant';
import type { Location, WeatherApiResponse } from '../types';

// Mock weather data for testing
const mockWeatherData: WeatherApiResponse = {
  location: {
    name: "Taipei, Taiwan",
    lat: 25.0330,
    lon: 121.5654
  },
  summary: {
    avgTemperature: {
      avgValue: 28,
      unit: "°C",
      description: "Historical average temperature"
    },
    maxTemperature: {
      avgValue: 32,
      unit: "°C",
      description: "Historical average maximum temperature"
    },
    minTemperature: {
      avgValue: 24,
      unit: "°C",
      description: "Historical average minimum temperature"
    },
    precipitation: {
      probability: 65,
      unit: "%",
      description: "Probability of precipitation"
    },
    windSpeed: {
      avgValue: 15,
      unit: "km/h",
      description: "Historical average wind speed"
    },
    humidity: {
      avgValue: 75,
      unit: "%",
      description: "Historical average relative humidity"
    },
    weatherType: {
      type: "Muggy",
      heatIndex: 31.2,
      unit: "°C",
      description: "Weather type: Muggy, feels like: 31.2°C"
    }
  },
  trendData: [
    { year: 2020, avgTemperature: 28.5, maxTemperature: 32.5, minTemperature: 24.5, precipitation: 10, windSpeed: 16, humidity: 81, weatherType: "Hot" },
    { year: 2021, avgTemperature: 28.1, maxTemperature: 32.1, minTemperature: 24.1, precipitation: 9, windSpeed: 15, humidity: 77, weatherType: "Muggy" },
    { year: 2022, avgTemperature: 28.7, maxTemperature: 32.7, minTemperature: 24.7, precipitation: 11, windSpeed: 16, humidity: 82, weatherType: "Hot" }
  ]
};

const mockLocation: Location = {
  lat: 25.0330,
  lon: 121.5654
};

// Test functions
export const testWeatherAssistant = async (): Promise<void> => {
  console.log('🧪 Testing Weather Assistant Integration...');
  
  try {
    // Test 1: Basic question
    console.log('📝 Test 1: Basic question');
    const basicResponse = await weatherAssistant.quickAsk("What's the weather like today?");
    console.log('✅ Basic question response:', basicResponse);
    
    // Test 2: Question with location
    console.log('📝 Test 2: Question with location');
    const locationResponse = await weatherAssistant.askWithLocation(
      "Is it good weather for outdoor activities?",
      mockLocation
    );
    console.log('✅ Location question response:', locationResponse);
    
    // Test 3: Question with weather data
    console.log('📝 Test 3: Question with weather data');
    const weatherResponse = await weatherAssistant.askWithWeatherData(
      "Please analyze the current weather conditions and provide recommendations.",
      mockLocation,
      mockWeatherData
    );
    console.log('✅ Weather data question response:', weatherResponse);
    
    console.log('🎉 All Weather Assistant tests passed!');
    
  } catch (error) {
    console.error('❌ Weather Assistant test failed:', error);
  }
};

// Test API connectivity
export const testWeatherAssistantConnectivity = async (): Promise<boolean> => {
  console.log('🔗 Testing Weather Assistant API connectivity...');
  
  try {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}/api/v1/weather/assistant`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        question: "Test connectivity"
      })
    });
    
    if (response.ok) {
      console.log('✅ Weather Assistant API is accessible');
      return true;
    } else {
      console.log('❌ Weather Assistant API returned error:', response.status);
      return false;
    }
  } catch (error) {
    console.error('❌ Weather Assistant API connectivity test failed:', error);
    return false;
  }
};

// Auto-run tests in development (disabled to reduce load)
if (import.meta.env.DEV && false) { // Disabled to prevent API overload
  setTimeout(() => {
    testWeatherAssistantConnectivity().then((isConnected) => {
      if (isConnected) {
        testWeatherAssistant();
      } else {
        console.log('⚠️ Weather Assistant API not available, skipping tests');
      }
    });
  }, 5000); // Wait 5 seconds for app to initialize
}
