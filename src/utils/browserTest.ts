// Browser compatibility test
import { BrowserCompatibility } from './browserCompatibility';
import { weatherApi } from '../services/api';

export const runBrowserCompatibilityTest = async (): Promise<void> => {
  console.log('🔍 Starting browser compatibility test...');
  
  // Check basic API support
  console.log('📋 Checking Web API support:');
  console.log(`  - Fetch API: ${BrowserCompatibility.supportsFetch() ? '✅' : '❌'}`);
  console.log(`  - Promise: ${BrowserCompatibility.supportsPromise() ? '✅' : '❌'}`);
  console.log(`  - AbortController: ${BrowserCompatibility.supportsAbortController() ? '✅' : '❌'}`);
  
  // Display browser information
  const browserInfo = BrowserCompatibility.getBrowserInfo();
  console.log(`🌐 Browser info: ${browserInfo.name} ${browserInfo.version} (${browserInfo.isModern ? 'Modern' : 'Legacy'})`);
  
  // Test API connection
  try {
    console.log('🔗 Testing API connection...');
    const health = await weatherApi.checkHealth();
    console.log('✅ API health check passed:', health);
  } catch (error) {
    console.error('❌ API connection failed:', error);
  }
  
  console.log('✅ Browser compatibility test completed');
};

// Automatically run tests in development environment (disabled to reduce load)
if (import.meta.env.DEV && false) { // Disabled to prevent API overload
  setTimeout(() => {
    runBrowserCompatibilityTest();
  }, 1000);
}
