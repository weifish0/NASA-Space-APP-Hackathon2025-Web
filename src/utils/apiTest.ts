// API 連接測試工具
import { weatherApi } from '../services/api';

export const testApiConnection = async (): Promise<{
  success: boolean;
  message: string;
  details: any;
}> => {
  console.log('🔍 開始 API 連接測試...');
  
  try {
    // 測試健康檢查
    console.log('1️⃣ 測試 API 健康檢查...');
    const health = await weatherApi.checkHealth();
    console.log('✅ API 健康檢查通過:', health);
    
    // 測試 NASA Power API
    console.log('2️⃣ 測試 NASA Power API...');
    const nasaTest = await weatherApi.testNasaApi();
    console.log('✅ NASA Power API 測試通過:', nasaTest);
    
    // 測試天氣分析（使用台北市作為測試）
    console.log('3️⃣ 測試天氣分析...');
    const weatherData = await weatherApi.getWeatherAnalysis({
      lat: 25.0330,
      lon: 121.5654,
      start_date: '20240115',
      years: 3
    });
    console.log('✅ 天氣分析測試通過:', weatherData);
    
    return {
      success: true,
      message: '所有 API 測試通過',
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
    console.error('❌ API 測試失敗:', error);
    return {
      success: false,
      message: `API 測試失敗: ${error instanceof Error ? error.message : '未知錯誤'}`,
      details: { error }
    };
  }
};

// 在開發環境中自動運行測試
if (import.meta.env.DEV) {
  setTimeout(() => {
    testApiConnection();
  }, 2000);
}
