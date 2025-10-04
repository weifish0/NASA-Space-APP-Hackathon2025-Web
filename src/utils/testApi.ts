// API 測試工具
import { weatherApi } from '../services/api';

// 測試 API 連接
export const testApiConnection = async () => {
  console.log('🔍 測試 API 連接...');
  
  try {
    // 測試健康檢查
    const health = await weatherApi.checkHealth();
    console.log('✅ API 健康檢查通過:', health);
    
    // 測試 NASA Power API
    const nasaTest = await weatherApi.testNasaApi();
    console.log('✅ NASA Power API 測試通過:', nasaTest);
    
    // 測試天氣分析（使用台北市作為測試）
    const weatherData = await weatherApi.getWeatherAnalysis({
      lat: 25.0330,
      lon: 121.5654,
      start_date: '20240115',
      years: 3
    });
    console.log('✅ 天氣分析測試通過:', weatherData);
    
    return true;
  } catch (error) {
    console.error('❌ API 測試失敗:', error);
    return false;
  }
};

// 在開發環境中自動運行測試
if (import.meta.env.DEV) {
  // 延遲 2 秒後運行測試，確保應用程式已載入
  setTimeout(() => {
    testApiConnection();
  }, 2000);
}
