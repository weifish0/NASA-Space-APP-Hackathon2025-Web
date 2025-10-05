import type { WeatherApiResponse, Location } from '../types';
import { BrowserCompatibility } from '../utils/browserCompatibility';

// ✅ 統一 Base URL：優先用環境變數，其次依環境判斷
const API_BASE_URL = (() => {
  // 優先使用環境變數
  if (import.meta.env.VITE_API_BASE_URL) {
    
    return import.meta.env.VITE_API_BASE_URL;
  }
  
  // 生產環境使用 HTTPS API
  if (import.meta.env.PROD) {
    return 'https://huei-ying-oh.zeabur.app';
  }
  
  // 開發環境使用本地 API
  return 'http://localhost:8000';
})();

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
  start_date: string;   // YYYYMMDD 或 YYYY-MM-DD（會自動格式化）
  end_date?: string;    // 同上
  years?: number;       // 歷史平均用
  trend_years?: number; // 趨勢圖回溯用
}

// 將日期從 YYYY-MM-DD 轉為 YYYYMMDD
const formatDateForApi = (date: string): string => date.replace(/-/g, '');

// 建立 API 錯誤
const createApiError = (message: string, status?: number): Error => {
  const error = new Error(message);
  (error as any).status = status;
  return error;
};

// 統一處理 API 回應
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
    throw createApiError('API 回應格式錯誤');
  }
};

// API 服務
export class WeatherApiService {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  // 健康檢查
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
        throw createApiError('API 請求超時，請檢查網路連接');
      }
      throw createApiError('無法連接到 API 服務，請檢查後端是否運行');
    }
  }

  // 測試 NASA Power API
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
        throw createApiError('NASA Power API 請求超時');
      }
      throw createApiError('NASA Power API 測試失敗');
    }
  }

  // 取得天氣分析
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

    // 參數驗證
    if (lat < -90 || lat > 90) {
      throw createApiError('緯度必須在 -90 到 90 之間');
    }
    if (lon < -180 || lon > 180) {
      throw createApiError('經度必須在 -180 到 180 之間');
    }
    if (years !== undefined && (years < YEARS_MIN || years > YEARS_MAX)) {
      throw createApiError(`歷史數據年數必須在 ${YEARS_MIN} 到 ${YEARS_MAX} 之間`);
    }
    if (trend_years !== undefined && (trend_years < YEARS_MIN || trend_years > YEARS_MAX)) {
      throw createApiError(`趨勢圖回溯年數必須在 ${YEARS_MIN} 到 ${YEARS_MAX} 之間`);
    }

    // 日期格式化（允許傳 YYYY-MM-DD）
    const formattedStart = formatDateForApi(start_date);
    const dateRegex = /^\d{8}$/;
    if (!dateRegex.test(formattedStart)) {
      throw createApiError('開始日期格式無效，請使用 YYYY-MM-DD 或 YYYYMMDD');
    }

    let formattedEnd = formattedStart;
    if (end_date) {
      formattedEnd = formatDateForApi(end_date);
      if (!dateRegex.test(formattedEnd)) {
        throw createApiError('結束日期格式無效，請使用 YYYY-MM-DD 或 YYYYMMDD');
      }
    }

    try {
      const controller = BrowserCompatibility.supportsAbortController() ? new AbortController() : null;
      const timeoutId = controller ? setTimeout(() => controller.abort(), 30000) : null; // 30s

      const url = new URL(`${this.baseUrl}/api/v1/weather/analysis`);
      url.searchParams.append('lat', String(lat));
      url.searchParams.append('lon', String(lon));
      url.searchParams.append('start_date', formattedStart);
      if (end_date) url.searchParams.append('end_date', formattedEnd);

      // 後端會同時用到 years（摘要平均）與 trend_years（趨勢筆數）
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
        throw createApiError('天氣分析請求超時，請稍後再試');
      }
      if (error instanceof Error && (error as any).status) {
        throw error; // 保留原始 API 錯誤
      }
      throw createApiError('獲取天氣分析數據失敗');
    }
  }
}

// 預設實例
export const weatherApi = new WeatherApiService();

// 便利函式：與 App.tsx 對接（第 4 個參數是 trendYears）
export const fetchWeatherData = async (
  location: Location,
  startDate: string,
  endDate?: string,
  trendYears: number = 10  // 使用者選擇的歷史年數
): Promise<WeatherApiResponse> => {
  const params = new URLSearchParams({
    lat: String(location.lat),
    lon: String(location.lon),
    start_date: startDate.replace(/-/g, ''),
  });

  if (endDate) params.set('end_date', endDate.replace(/-/g, ''));

  params.set('years', String(trendYears));
  params.set('trend_years', String(trendYears)); // ✅ 關鍵

  const apiUrl = `${API_BASE_URL}/api/v1/weather/analysis?${params.toString()}`;
  
  // 調試信息
  console.log('🌐 API 請求 URL:', apiUrl);
  console.log('🔧 環境變數 VITE_API_BASE_URL:', import.meta.env.VITE_API_BASE_URL);
  console.log('🔧 環境變數 PROD:', import.meta.env.PROD);
  console.log('🔧 最終 API_BASE_URL:', API_BASE_URL);

  const res = await fetch(apiUrl);
  if (!res.ok) throw new Error(`API error (${res.status})`);
  return res.json();
};