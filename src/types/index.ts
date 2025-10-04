// 位置座標類型
export interface Location {
  lat: number;
  lon: number;
}

// 位置資訊類型
export interface LocationInfo {
  name: string;
  lat: number;
  lon: number;
}

// 天氣數據摘要類型
export interface WeatherSummary {
  avgTemperature: {
    avgValue: number;
    unit: string;
    description: string;
  };
  maxTemperature: {
    avgValue: number;
    unit: string;
    description: string;
  };
  minTemperature: {
    avgValue: number;
    unit: string;
    description: string;
  };
  precipitation: {
    probability: number;
    unit: string;
    description: string;
  };
  windSpeed: {
    avgValue: number;
    unit: string;
    description: string;
  };
  humidity: {
    avgValue: number;
    unit: string;
    description: string;
  };
  weatherType: {
    type: string;
    heatIndex: number;
    unit: string;
    description: string;
  };
}

// 歷史趨勢數據類型
export interface TrendDataPoint {
  year: number;
  avgTemperature: number;
  maxTemperature: number;
  minTemperature: number;
  precipitation: number;
  windSpeed: number;
  humidity: number;
  weatherType: string;
}

// API 回應類型
export interface WeatherApiResponse {
  location: LocationInfo;
  summary: WeatherSummary;
  trendData: TrendDataPoint[];
}

// API 錯誤類型
export interface ApiError {
  error: string;
  message: string;
  timestamp: string;
}

// 天氣分析請求參數
export interface WeatherAnalysisParams {
  lat: number;
  lon: number;
  date: string; // YYYYMMDD 格式
  years?: number; // 可選，預設 5
}

// 概率卡片屬性類型
export interface ProbabilityCardProps {
  title: string;
  value: string;
  probability: string;
  icon: string;
}

// 圖表數據類型
export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor: string;
    backgroundColor: string;
    tension: number;
  }[];
}
