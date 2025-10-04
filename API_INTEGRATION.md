# API 集成說明

## 概述

前端應用程式已成功集成 Event Horizon Weather API，使用 TypeScript 進行類型安全的 API 調用。

## 主要功能

### 1. API 服務 (`src/services/api.ts`)

- **WeatherApiService 類別**: 封裝所有 API 調用邏輯
- **錯誤處理**: 完整的 HTTP 狀態碼和錯誤訊息處理
- **參數驗證**: 自動驗證緯度、經度和日期格式
- **日期轉換**: 自動將 YYYY-MM-DD 格式轉換為 API 所需的 YYYYMMDD 格式

### 2. 類型定義 (`src/types/index.ts`)

- 完整的 TypeScript 類型定義
- 與 API 文檔完全匹配的數據結構
- 包含錯誤處理和請求參數類型

### 3. 用戶界面更新

- **API 狀態指示器**: 實時顯示 API 連接狀態
- **詳細錯誤訊息**: 根據不同錯誤類型顯示相應的用戶友好訊息
- **載入狀態**: 改進的載入提示，包含數據來源信息

## API 端點集成

### 已集成的端點

1. **GET /** - 健康檢查
   - 用於檢查 API 服務狀態
   - 在應用程式啟動時自動調用

2. **GET /api/v1/test-nasa** - NASA Power API 測試
   - 測試 NASA Power API 連接
   - 可選的緯度和經度參數

3. **GET /api/v1/weather/analysis** - 天氣分析數據
   - 主要功能端點
   - 根據位置和日期獲取歷史天氣數據分析

### 未集成的端點

- **GET /api/v1/location/suggestions** - 位置建議
  - 目前返回模擬數據，暫時未集成

## 配置

### API 基礎 URL

```typescript
const API_BASE_URL = 'http://0.0.0.0:8000';
```

### 環境變數

目前使用硬編碼的 API URL，如需更改可修改 `src/services/api.ts` 中的 `API_BASE_URL` 常數。

## 使用方式

### 基本使用

```typescript
import { fetchWeatherData } from './services/api';

// 獲取天氣數據
const weatherData = await fetchWeatherData(
  { lat: 25.0330, lon: 121.5654 }, // 位置
  '2024-01-15', // 日期 (YYYY-MM-DD)
  5 // 歷史年數 (可選，預設 5)
);
```

### 高級使用

```typescript
import { weatherApi } from './services/api';

// 檢查 API 健康狀態
const health = await weatherApi.checkHealth();

// 測試 NASA Power API
const nasaTest = await weatherApi.testNasaApi(25.0330, 121.5654);

// 獲取天氣分析
const analysis = await weatherApi.getWeatherAnalysis({
  lat: 25.0330,
  lon: 121.5654,
  date: '20240115', // YYYYMMDD 格式
  years: 5
});
```

## 錯誤處理

### HTTP 狀態碼處理

- **400**: 請求參數錯誤
- **422**: 數據驗證錯誤
- **500**: 服務器內部錯誤
- **502**: NASA Power API 服務錯誤

### 錯誤訊息

所有錯誤都會顯示用戶友好的中文訊息，並在控制台記錄詳細的錯誤信息。

## 開發和測試

### 自動測試

在開發環境中，應用程式會自動運行 API 連接測試：

```typescript
// src/utils/testApi.ts
import { testApiConnection } from './utils/testApi';

// 手動運行測試
const isConnected = await testApiConnection();
```

### 調試

1. 打開瀏覽器開發者工具
2. 查看控制台輸出
3. 檢查網路請求標籤頁
4. 觀察 API 狀態指示器

## 注意事項

1. **CORS**: 確保後端 API 已正確配置 CORS 設定
2. **網路連接**: 確保後端服務正在運行在 `http://0.0.0.0:8000`
3. **日期格式**: 前端使用 YYYY-MM-DD 格式，API 自動轉換為 YYYYMMDD
4. **錯誤處理**: 所有 API 調用都包含適當的錯誤處理

## 故障排除

### 常見問題

1. **API 連接失敗**
   - 檢查後端服務是否正在運行
   - 確認 API URL 是否正確
   - 檢查網路連接

2. **CORS 錯誤**
   - 確認後端已配置正確的 CORS 設定
   - 檢查請求頭是否正確

3. **數據格式錯誤**
   - 檢查日期格式是否正確
   - 確認緯度經度範圍是否有效

### 調試步驟

1. 檢查瀏覽器控制台錯誤訊息
2. 查看網路請求的狀態碼和回應
3. 使用 API 測試工具驗證連接
4. 檢查後端服務日誌

## 未來改進

1. 添加位置建議 API 集成
2. 實現 API 響應緩存
3. 添加重試機制
4. 支持環境變數配置
5. 添加更多錯誤處理選項
