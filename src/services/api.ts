import type { WeatherApiResponse, Location } from '../types';
import { BrowserCompatibility } from '../utils/browserCompatibility';

// ✅ Unified Base URL: prioritize environment variables, then determine by environment
const API_BASE_URL = (() => {
  // Prioritize environment variables
  if (import.meta.env.VITE_API_BASE_URL) {
    
    return import.meta.env.VITE_API_BASE_URL;
  }
  
  // Production environment uses HTTPS API
  if (import.meta.env.PROD) {
    return 'https://huei-ying-oh.zeabur.app';
  }
  
  // Development environment uses local API
  return 'http://localhost:8000';
})();

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
  start_date: string;   // YYYYMMDD or YYYY-MM-DD (will be automatically formatted)
  end_date?: string;    // Same as above
  years?: number;       // For historical average
  trend_years?: number; // For trend chart lookback
}

// Convert date from YYYY-MM-DD to YYYYMMDD
const formatDateForApi = (date: string): string => date.replace(/-/g, '');

// Create API error
const createApiError = (message: string, status?: number): Error => {
  const error = new Error(message);
  (error as any).status = status;
  return error;
};

// Unified API response handling
const handleApiResponse = async (response: Response): Promise<any> => {
  if (!response.ok) {
    let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
    try {
      const errorData: ApiError = await response.json();
      errorMessage = errorData.message || errorData.error || errorMessage;
    } catch {
      /* ignore parse error */
    }
    throw createApiError(errorMessage, response.status);
  }

  try {
    return await response.json();
  } catch {
    throw createApiError('API response format error');
  }
};

// API service
export class WeatherApiService {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  // Health check
  async checkHealth(): Promise<{ status: string; message: string }> {
    try {
      const controller = BrowserCompatibility.supportsAbortController() ? new AbortController() : null;
      const timeoutId = controller ? setTimeout(() => controller.abort(), 10000) : null; // 10s

      const response = await BrowserCompatibility.createFetchRequest(`${this.baseUrl}/`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        signal: controller?.signal,
      });

      if (timeoutId) clearTimeout(timeoutId);
      return await handleApiResponse(response);
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        throw createApiError('API request timeout, please check network connection');
      }
      throw createApiError('Unable to connect to API service, please check if backend is running');
    }
  }

  // Test NASA Power API
  async testNasaApi(lat: number = 25.0330, lon: number = 121.5654): Promise<any> {
    try {
      const controller = BrowserCompatibility.supportsAbortController() ? new AbortController() : null;
      const timeoutId = controller ? setTimeout(() => controller.abort(), 15000) : null; // 15s

      const response = await BrowserCompatibility.createFetchRequest(
        `${this.baseUrl}/api/v1/test-nasa?lat=${lat}&lon=${lon}`,
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          signal: controller?.signal,
        }
      );

      if (timeoutId) clearTimeout(timeoutId);
      return await handleApiResponse(response);
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        throw createApiError('NASA Power API request timeout');
      }
      throw createApiError('NASA Power API test failed');
    }
  }

  // Get weather analysis
  async getWeatherAnalysis(params: WeatherAnalysisParams): Promise<WeatherApiResponse> {
    const YEARS_MIN = 1;
    const YEARS_MAX = 50;

    const {
      lat,
      lon,
      start_date,
      end_date,
      years = 5,
      trend_years,
    } = params;

    // Parameter validation
    if (lat < -90 || lat > 90) {
      throw createApiError('Latitude must be between -90 and 90');
    }
    if (lon < -180 || lon > 180) {
      throw createApiError('Longitude must be between -180 and 180');
    }
    if (years !== undefined && (years < YEARS_MIN || years > YEARS_MAX)) {
      throw createApiError(`Historical data years must be between ${YEARS_MIN} and ${YEARS_MAX}`);
    }
    if (trend_years !== undefined && (trend_years < YEARS_MIN || trend_years > YEARS_MAX)) {
      throw createApiError(`Trend chart lookback years must be between ${YEARS_MIN} and ${YEARS_MAX}`);
    }

    // Date formatting (allows YYYY-MM-DD)
    const formattedStart = formatDateForApi(start_date);
    const dateRegex = /^\d{8}$/;
    if (!dateRegex.test(formattedStart)) {
      throw createApiError('Invalid start date format, please use YYYY-MM-DD or YYYYMMDD');
    }

    let formattedEnd = formattedStart;
    if (end_date) {
      formattedEnd = formatDateForApi(end_date);
      if (!dateRegex.test(formattedEnd)) {
        throw createApiError('Invalid end date format, please use YYYY-MM-DD or YYYYMMDD');
      }
    }

    try {
      const controller = BrowserCompatibility.supportsAbortController() ? new AbortController() : null;
      const timeoutId = controller ? setTimeout(() => controller.abort(), 120000) : null; // 120s for weather analysis

      const url = new URL(`${this.baseUrl}/api/v1/weather/analysis`);
      url.searchParams.append('lat', String(lat));
      url.searchParams.append('lon', String(lon));
      url.searchParams.append('start_date', formattedStart);
      if (end_date) url.searchParams.append('end_date', formattedEnd);

      // Backend will use both years (summary average) and trend_years (trend count)
      url.searchParams.append('years', String(years));
      if (trend_years !== undefined) {
        url.searchParams.append('trend_years', String(trend_years));
      }

      const response = await BrowserCompatibility.createFetchRequest(url.toString(), {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        signal: controller?.signal,
      });

      if (timeoutId) clearTimeout(timeoutId);
      return await handleApiResponse(response);
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        throw createApiError('Weather analysis request timeout, please try again later');
      }
      if (error instanceof Error && (error as any).status) {
        throw error; // Preserve original API error
      }
      throw createApiError('Failed to get weather analysis data');
    }
  }
}

// Default instance
export const weatherApi = new WeatherApiService();

// Convenience function: interface with App.tsx (4th parameter is trendYears)
export const fetchWeatherData = async (
  location: Location,
  startDate: string,
  endDate?: string,
  trendYears: number = 10  // User-selected historical years
): Promise<WeatherApiResponse> => {
  const params = new URLSearchParams({
    lat: String(location.lat),
    lon: String(location.lon),
    start_date: startDate.replace(/-/g, ''),
  });

  if (endDate) params.set('end_date', endDate.replace(/-/g, ''));

  params.set('years', String(trendYears));
  params.set('trend_years', String(trendYears)); // ✅ Key

  const apiUrl = `${API_BASE_URL}/api/v1/weather/analysis?${params.toString()}`;
  
  // Debug information
  console.log('🌐 API request URL:', apiUrl);
  console.log('🔧 Environment variable VITE_API_BASE_URL:', import.meta.env.VITE_API_BASE_URL);
  console.log('🔧 Environment variable PROD:', import.meta.env.PROD);
  console.log('🔧 Final API_BASE_URL:', API_BASE_URL);

  const res = await fetch(apiUrl);
  if (!res.ok) throw new Error(`API error (${res.status})`);
  return res.json();
};