// API testing tool
import { weatherApi } from '../services/api';

// Test API connection
export const testApiConnection = async () => {
  console.log('🔍 Testing API connection...');
  
  try {
    // Test health check
    const health = await weatherApi.checkHealth();
    console.log('✅ API health check passed:', health);
    
    // Test NASA Power API
    const nasaTest = await weatherApi.testNasaApi();
    console.log('✅ NASA Power API test passed:', nasaTest);
    
    return true;
  } catch (error) {
    console.error('❌ API test failed:', error);
    return false;
  }
};

// Automatically run tests in development environment (disabled to reduce load)
if (import.meta.env.DEV && false) { // Disabled to prevent API overload
  // Run test after 2 seconds delay to ensure app is loaded
  setTimeout(() => {
    testApiConnection();
  }, 2000);
}
