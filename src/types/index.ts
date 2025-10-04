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
  maxTemperature: {
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
}

// 歷史趨勢數據類型
export interface TrendDataPoint {
  year: number;
  maxTemperature: number;
  precipitation: number;
  windSpeed: number;
}

// API 回應類型
export interface WeatherApiResponse {
  location: LocationInfo;
  summary: WeatherSummary;
  trendData: TrendDataPoint[];
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
