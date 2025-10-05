// Manual API testing tool - Run this in browser console
import { weatherApi } from '../services/api';
import { weatherAssistant } from '../services/weatherAssistant';

// Export functions to global scope for manual testing
(window as any).testAPI = {
  // Test basic API health
  async health() {
    console.log('🔍 Testing API health...');
    try {
      const result = await weatherApi.checkHealth();
      console.log('✅ Health check passed:', result);
      return result;
    } catch (error) {
      console.error('❌ Health check failed:', error);
      return error;
    }
  },

  // Test NASA Power API
  async nasa() {
    console.log('🔍 Testing NASA Power API...');
    try {
      const result = await weatherApi.testNasaApi();
      console.log('✅ NASA API test passed:', result);
      return result;
    } catch (error) {
      console.error('❌ NASA API test failed:', error);
      return error;
    }
  },

  // Test weather analysis with minimal data
  async weather() {
    console.log('🔍 Testing weather analysis...');
    try {
      const result = await weatherApi.getWeatherAnalysis({
        lat: 25.0330,
        lon: 121.5654,
        start_date: '20240115',
        years: 2, // Reduced for faster testing
        trend_years: 3
      });
      console.log('✅ Weather analysis passed:', result);
      return result;
    } catch (error) {
      console.error('❌ Weather analysis failed:', error);
      return error;
    }
  },

  // Test AI assistant
  async assistant() {
    console.log('🔍 Testing AI assistant...');
    try {
      const result = await weatherAssistant.quickAsk("What's the weather like today?");
      console.log('✅ AI assistant test passed:', result);
      return result;
    } catch (error) {
      console.error('❌ AI assistant test failed:', error);
      return error;
    }
  },

  // Run all tests sequentially
  async all() {
    console.log('🚀 Running all API tests...');
    console.log('================================');
    
    await this.health();
    console.log('================================');
    
    await this.nasa();
    console.log('================================');
    
    await this.weather();
    console.log('================================');
    
    await this.assistant();
    console.log('================================');
    
    console.log('✅ All tests completed!');
  }
};

console.log('🧪 Manual API testing tools loaded!');
console.log('Usage:');
console.log('  testAPI.health()     - Test API health');
console.log('  testAPI.nasa()       - Test NASA Power API');
console.log('  testAPI.weather()    - Test weather analysis');
console.log('  testAPI.assistant()  - Test AI assistant');
console.log('  testAPI.all()        - Run all tests');
