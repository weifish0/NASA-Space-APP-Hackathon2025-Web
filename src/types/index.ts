// Location coordinates type
export interface Location {
  lat: number;
  lon: number;
}

// Location information type
export interface LocationInfo {
  name: string;
  lat: number;
  lon: number;
}

// Weather data summary type
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

// Historical trend data type
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

// API response type
export interface WeatherApiResponse {
  location: LocationInfo;
  summary: WeatherSummary;
  trendData: TrendDataPoint[];
}

// API error type
export interface ApiError {
  error: string;
  message: string;
  timestamp: string;
}

// Weather analysis request parameters
export interface WeatherAnalysisParams {
  lat: number;
  lon: number;
  start_date: string; // YYYYMMDD format
  end_date?: string; // YYYYMMDD format, optional, defaults to start_date
  years?: number; // Optional, defaults to 5
}

// Probability card properties type
export interface ProbabilityCardProps {
  title: string;
  value: string;
  probability: string;
  icon: string;
}

// Chart data type
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
