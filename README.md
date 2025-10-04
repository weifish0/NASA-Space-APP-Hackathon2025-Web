# Event Horizon Weather - 天氣風險分析平台

基於歷史天氣數據的智能風險分析平台，為 NASA Space App Challenge 2025 開發。

## 功能特色

- 🗺️ **互動式地圖選擇** - 使用 Leaflet 地圖讓用戶點擊或搜尋選擇地點
- 📅 **日期選擇器** - 選擇特定日期進行天氣分析
- 📊 **概率卡片** - 顯示最高溫度、降雨機率、平均風速的歷史數據
- 📈 **趨勢圖表** - 使用 Chart.js 展示過去20年的天氣趨勢
- 📥 **數據導出** - 支援 CSV 格式下載歷史數據
- 🎨 **現代化 UI** - 使用 Tailwind CSS 打造響應式設計

## 技術棧

- **前端框架**: React 18 + TypeScript
- **建構工具**: Vite
- **樣式**: Tailwind CSS
- **地圖**: Leaflet + React-Leaflet
- **圖表**: Chart.js + react-chartjs-2
- **日期處理**: date-fns

## 快速開始

### 安裝依賴

```bash
npm install
```

### 開發模式

```bash
npm run dev
```

應用程式將在 `http://localhost:5173` 啟動

### 建構生產版本

```bash
npm run build
```

### 預覽生產版本

```bash
npm run preview
```

## 使用說明

1. **選擇地點**: 
   - 在地圖上點擊任意位置
   - 或在搜尋框中輸入地點名稱並按 Enter

2. **選擇日期**: 
   - 使用日期選擇器選擇要分析的日期

3. **查看分析結果**: 
   - 系統會自動載入該地點的歷史天氣數據
   - 查看概率卡片了解天氣風險
   - 瀏覽趨勢圖表了解歷史變化
   - 可切換不同天氣指標（溫度、降雨、風速）

4. **下載數據**: 
   - 點擊「下載 CSV」按鈕將歷史數據保存到本地

## 專案結構

```
src/
├── components/          # React 組件
│   ├── LocationSelector.tsx    # 地圖和搜尋組件
│   ├── ProbabilityCard.tsx     # 概率卡片組件
│   ├── AnalysisDashboard.tsx   # 分析儀表板
│   └── TrendChart.tsx          # 趨勢圖表組件
├── data/               # 模擬數據
│   └── mockData.ts     # API 模擬數據
├── types/              # TypeScript 類型定義
│   └── index.ts        # 共用類型
├── App.tsx             # 主應用組件
├── main.tsx            # 應用入口點
└── index.css           # 全域樣式
```

## 開發說明

### 模擬數據

目前使用模擬數據進行演示，實際部署時需要連接真實的天氣 API。

### 自定義配置

- 地圖中心位置可在 `LocationSelector.tsx` 中修改
- 模擬數據可在 `mockData.ts` 中調整
- 樣式可在 `index.css` 中自定義

## 授權

此專案為 NASA Space App Challenge 2025 參賽作品。

## 貢獻

歡迎提交 Issue 和 Pull Request 來改善此專案。
