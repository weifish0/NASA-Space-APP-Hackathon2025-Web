// 瀏覽器兼容性測試
import { BrowserCompatibility } from './browserCompatibility';
import { weatherApi } from '../services/api';

export const runBrowserCompatibilityTest = async (): Promise<void> => {
  console.log('🔍 開始瀏覽器兼容性測試...');
  
  // 檢查基本 API 支援
  console.log('📋 檢查 Web API 支援:');
  console.log(`  - Fetch API: ${BrowserCompatibility.supportsFetch() ? '✅' : '❌'}`);
  console.log(`  - Promise: ${BrowserCompatibility.supportsPromise() ? '✅' : '❌'}`);
  console.log(`  - AbortController: ${BrowserCompatibility.supportsAbortController() ? '✅' : '❌'}`);
  
  // 顯示瀏覽器資訊
  const browserInfo = BrowserCompatibility.getBrowserInfo();
  console.log(`🌐 瀏覽器資訊: ${browserInfo.name} ${browserInfo.version} (${browserInfo.isModern ? '現代' : '舊版'})`);
  
  // 測試 API 連接
  try {
    console.log('🔗 測試 API 連接...');
    const health = await weatherApi.checkHealth();
    console.log('✅ API 健康檢查通過:', health);
  } catch (error) {
    console.error('❌ API 連接失敗:', error);
  }
  
  console.log('✅ 瀏覽器兼容性測試完成');
};

// 在開發環境中自動運行測試
if (import.meta.env.DEV) {
  setTimeout(() => {
    runBrowserCompatibilityTest();
  }, 1000);
}
