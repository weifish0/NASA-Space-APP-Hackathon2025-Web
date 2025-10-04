import type { WeatherApiResponse, Location } from '../types';
import { BrowserCompatibility } from '../utils/browserCompatibility';

// API 基礎配置
const API_BASE_URL = import.meta.env.PROD 
  ? 'https://your-production-api.com' 
  : 'http://localhost:8000';

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
  start_date: string; // YYYYMMDD 格式
  end_date?: string; // YYYYMMDD 格式，可選，預設與start_date相同
  years?: number; // 可選，預設 5
}

// 將日期從 YYYY-MM-DD 轉換為 YYYYMMDD 格式
const formatDateForApi = (date: string): string => {
  return date.replace(/-/g, '');
};

// 創建 API 錯誤
const createApiError = (message: string, status?: number): Error => {
  const error = new Error(message);
  (error as any).status = status;
  return error;
};

// 處理 API 回應
const handleApiResponse = async (response: Response): Promise<any> => {
  if (!response.ok) {
    let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
    
    try {
      const errorData: ApiError = await response.json();
      errorMessage = errorData.message || errorData.error || errorMessage;
    } catch (parseError) {
      // 如果無法解析錯誤 JSON，使用預設錯誤訊息
      console.warn('無法解析錯誤回應:', parseError);
    }
    
    throw createApiError(errorMessage, response.status);
  }
  
  try {
    return await response.json();
  } catch (parseError) {
    console.error('無法解析 API 回應:', parseError);
    throw createApiError('API 回應格式錯誤');
  }
};

// API 服務類
export class WeatherApiService {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  // 檢查 API 服務狀態
  async checkHealth(): Promise<{ status: string; message: string }> {
    try {
      const controller = BrowserCompatibility.supportsAbortController() ? new AbortController() : null;
      const timeoutId = controller ? setTimeout(() => controller.abort(), 10000) : null; // 10秒超時
      
      const response = await BrowserCompatibility.createFetchRequest(`${this.baseUrl}/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: controller?.signal,
      });
      
      if (timeoutId) clearTimeout(timeoutId);
      return await handleApiResponse(response);
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        throw createApiError('API 請求超時，請檢查網路連接');
      }
      throw createApiError('無法連接到 API 服務，請檢查後端是否運行');
    }
  }

  // 測試 NASA Power API 連接
  async testNasaApi(lat: number = 25.0330, lon: number = 121.5654): Promise<any> {
    try {
      const controller = BrowserCompatibility.supportsAbortController() ? new AbortController() : null;
      const timeoutId = controller ? setTimeout(() => controller.abort(), 15000) : null; // 15秒超時
      
      const response = await BrowserCompatibility.createFetchRequest(
        `${this.baseUrl}/api/v1/test-nasa?lat=${lat}&lon=${lon}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          signal: controller?.signal,
        }
      );
      
      if (timeoutId) clearTimeout(timeoutId);
      return await handleApiResponse(response);
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        throw createApiError('NASA Power API 請求超時');
      }
      throw createApiError('NASA Power API 測試失敗');
    }
  }

  // 獲取天氣分析數據
  async getWeatherAnalysis(params: WeatherAnalysisParams): Promise<WeatherApiResponse> {
    const { lat, lon, start_date, end_date, years = 5 } = params;
    
    // 驗證參數
    if (lat < -90 || lat > 90) {
      throw createApiError('緯度必須在 -90 到 90 之間');
    }
    
    if (lon < -180 || lon > 180) {
      throw createApiError('經度必須在 -180 到 180 之間');
    }
    
    if (years < 1 || years > 10) {
      throw createApiError('歷史數據年數必須在 1 到 10 之間');
    }
    
    // 驗證日期格式
    const formattedStartDate = formatDateForApi(start_date);
    const dateRegex = /^\d{8}$/;
    if (!dateRegex.test(formattedStartDate)) {
      throw createApiError('開始日期格式無效，請使用 YYYY-MM-DD 格式');
    }
    
    let formattedEndDate = formattedStartDate;
    if (end_date) {
      formattedEndDate = formatDateForApi(end_date);
      if (!dateRegex.test(formattedEndDate)) {
        throw createApiError('結束日期格式無效，請使用 YYYY-MM-DD 格式');
      }
    }

    try {
      const controller = BrowserCompatibility.supportsAbortController() ? new AbortController() : null;
      const timeoutId = controller ? setTimeout(() => controller.abort(), 30000) : null; // 30秒超時
      
      const url = new URL(`${this.baseUrl}/api/v1/weather/analysis`);
      url.searchParams.append('lat', lat.toString());
      url.searchParams.append('lon', lon.toString());
      url.searchParams.append('start_date', formattedStartDate);
      if (end_date) {
        url.searchParams.append('end_date', formattedEndDate);
      }
      url.searchParams.append('years', years.toString());

      const response = await BrowserCompatibility.createFetchRequest(url.toString(), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: controller?.signal,
      });
      
      if (timeoutId) clearTimeout(timeoutId);
      return await handleApiResponse(response);
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        throw createApiError('天氣分析請求超時，請稍後再試');
      }
      if (error instanceof Error && (error as any).status) {
        throw error; // 重新拋出 API 錯誤
      }
      throw createApiError('獲取天氣分析數據失敗');
    }
  }
}

// 創建預設 API 服務實例
export const weatherApi = new WeatherApiService();

// 便利函數：獲取天氣數據（保持與現有代碼的兼容性）
export const fetchWeatherData = async (
  location: Location, 
  startDate: string, 
  endDate?: string,
  years: number = 5
): Promise<WeatherApiResponse> => {
  return weatherApi.getWeatherAnalysis({
    lat: location.lat,
    lon: location.lon,
    start_date: startDate,
    end_date: endDate,
    years: years
  });
};
