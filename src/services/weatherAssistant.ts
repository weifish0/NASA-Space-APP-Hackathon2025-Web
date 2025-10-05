import type { Location } from '../types';

// Weather assistant request type
export interface WeatherAssistantRequest {
  question: string;
  location?: Location;
  weather_data?: any; 
}

// Weather assistant response type
export interface WeatherAssistantResponse {
  answer: string;
  sources?: string[];
  confidence?: number;
  timestamp: string;
}

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

// Weather assistant API service
export class WeatherAssistantService {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  /**
   * 主要邏輯：將問題和上下文(地點、天氣數據)發送到後端 AI Assistant
   * @param request - 包含問題和可選地點/天氣數據的請求物件
   * @returns AI 的回應
   */
  async askQuestion(request: WeatherAssistantRequest): Promise<WeatherAssistantResponse> {
    // ⚠️ 注意：後端 /api/v1/weather/assistant 端點必須能接收這個 WeatherAssistantRequest 格式的 JSON Body
    try {
      const response = await fetch(`${this.baseUrl}/api/v1/weather/assistant`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        // 增強錯誤處理：嘗試解析後端回傳的詳細錯誤訊息
        let errorDetail = `HTTP ${response.status}: ${response.statusText}`;
        try {
          const errorData = await response.json();
          // FastAPI 的驗證錯誤通常放在 errorData.detail
          if (errorData.detail) {
             errorDetail = typeof errorData.detail === 'string' 
               ? errorData.detail 
               : JSON.stringify(errorData.detail);
          }
        } catch (e) {
          // 如果回應不是有效的 JSON，則使用原始文字作為錯誤訊息
          errorDetail = await response.text();
        }
        throw new Error(errorDetail);
      }

      return await response.json();

    } catch (error) {
      console.error('Weather assistant API call failed:', error);
      // 將錯誤向上拋出，讓 UI 層可以捕捉並顯示給使用者
      throw error;
    }
  }

  // Quick ask (only question needed)
  async quickAsk(question: string): Promise<WeatherAssistantResponse> {
    return this.askQuestion({ question });
  }

  // Ask with location information
  async askWithLocation(question: string, location: Location): Promise<WeatherAssistantResponse> {
    return this.askQuestion({ question, location });
  }
  
  /**
   * ✅ 優化：建立一個更豐富的提示 (Prompt) 來引導 AI
   * @param originalQuestion 使用者的原始問題
   * @param weatherData 天氣數據分析結果
   * @returns 一個結構化的、資訊更豐富的問題字串
   */
  private createEnhancedPrompt(originalQuestion: string, weatherData: any): string {
    const summary = weatherData.summary;
    const location = weatherData.location;
    
    // 這是我們精心設計的「提示模板」
    const prompt = `
      You are an expert weather risk assessment AI. 
      Based on the following historical weather summary for a location, please answer the user's question. 
      Your goal is to provide a concise 2-4 sentence summary identifying the main weather risk and offering one or two practical recommendations related to their query.

      **Provided Context:**
      - **Location Name:** ${location.name || 'Not specified'}
      - **Coordinates:** Latitude ${location.lat.toFixed(4)}, Longitude ${location.lon.toFixed(4)}
      - **Historical Average Max Temperature:** ${summary.maxTemperature.avgValue.toFixed(1)} ${summary.maxTemperature.unit}
      - **Historical Precipitation Probability:** ${summary.precipitation.probability.toFixed(1)} ${summary.precipitation.unit}
      - **Historical Average Wind Speed:** ${summary.windSpeed.avgValue.toFixed(1)} ${summary.windSpeed.unit}

      **User's Question:**
      "${originalQuestion}"

      Please provide your risk assessment and recommendations now.
    `;
    
    return prompt.trim(); // trim() 移除前後多餘的空白
  }

  /**
   * ✅ 優化：使用增強後的提示來提問
   */
  async askWithWeatherData(
    question: string, 
    location: Location, 
    weatherData: any
  ): Promise<WeatherAssistantResponse> {
    // 呼叫輔助函式來建立更詳細的問題
    const enhancedQuestion = this.createEnhancedPrompt(question, weatherData);

    return this.askQuestion({ 
      question: enhancedQuestion, // 傳送優化後的問題
      location, 
      weather_data: weatherData 
    });
  }
}

// Create default instance
export const weatherAssistant = new WeatherAssistantService();

// Convenience functions (no changes needed here)
export const askWeatherQuestion = async (question: string): Promise<WeatherAssistantResponse> => {
  return weatherAssistant.quickAsk(question);
};

export const askWeatherQuestionWithLocation = async (
  question: string, 
  location: Location
): Promise<WeatherAssistantResponse> => {
  return weatherAssistant.askWithLocation(question, location);
};

export const askWeatherQuestionWithData = async (
  question: string,
  location: Location,
  weatherData: any
): Promise<WeatherAssistantResponse> => {
  return weatherAssistant.askWithWeatherData(question, location, weatherData);
};