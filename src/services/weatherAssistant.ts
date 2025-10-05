import type { Location } from '../types';

// Weather assistant request type
export interface WeatherAssistantRequest {
  question: string;
  location?: Location;
  weather_data?: any; // Can be any weather data
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

  // Ask weather questions
  async askQuestion(request: WeatherAssistantRequest): Promise<WeatherAssistantResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/v1/weather/assistant`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || `HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Weather assistant API call failed:', error);
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

  // Ask with weather data
  async askWithWeatherData(
    question: string, 
    location: Location, 
    weatherData: any
  ): Promise<WeatherAssistantResponse> {
    return this.askQuestion({ 
      question, 
      location, 
      weather_data: weatherData 
    });
  }
}

// Create default instance
export const weatherAssistant = new WeatherAssistantService();

// Convenience functions
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
