import React, { useState } from 'react';
import { weatherAssistant } from '../services/weatherAssistant';
import type { Location, WeatherApiResponse } from '../types';

interface WeatherAssistantProps {
  selectedLocation?: Location;
  weatherData?: WeatherApiResponse;
}

const WeatherAssistant: React.FC<WeatherAssistantProps> = ({ 
  selectedLocation, 
  weatherData 
}) => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confidence, setConfidence] = useState<number | null>(null);
  const [sources, setSources] = useState<string[]>([]);

  const handleAskQuestion = async () => {
    if (!question.trim()) {
      setError('Please enter a question');
      return;
    }

    setLoading(true);
    setError(null);
    setAnswer('');

    try {
      let response;
      
      if (selectedLocation && weatherData) {
        // Ask with location and weather data
        response = await weatherAssistant.askWithWeatherData(
          question,
          selectedLocation,
          weatherData
        );
      } else if (selectedLocation) {
        // Ask with location information
        response = await weatherAssistant.askWithLocation(
          question,
          selectedLocation
        );
      } else {
        // Basic ask
        response = await weatherAssistant.quickAsk(question);
      }

      setAnswer(response.answer);
      setConfidence(response.confidence || null);
      setSources(response.sources || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAskQuestion();
    }
  };

  const clearChat = () => {
    setQuestion('');
    setAnswer('');
    setError(null);
    setConfidence(null);
    setSources([]);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          🤖 Weather Analysis Assistant
        </h3>
        <button
          onClick={clearChat}
          className="text-sm text-gray-500 hover:text-gray-700 px-2 py-1 rounded"
        >
          Clear Chat
        </button>
      </div>

      {/* Question input area */}
      <div className="mb-4">
        <label htmlFor="question" className="block text-sm font-medium text-gray-700 mb-2">
          Ask weather-related questions
        </label>
        <div className="flex gap-2">
          <textarea
            id="question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="e.g., Is it suitable to go out today? What are the climate characteristics of this region?"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            rows={3}
            disabled={loading}
          />
          <button
            onClick={handleAskQuestion}
            disabled={loading || !question.trim()}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Analyzing...
              </>
            ) : (
              'Ask'
            )}
          </button>
        </div>
      </div>

      {/* Context information */}
      {(selectedLocation || weatherData) && (
        <div className="mb-4 p-3 bg-blue-50 rounded-md">
          <h4 className="text-sm font-medium text-blue-900 mb-1">Current Context</h4>
          {selectedLocation && (
            <p className="text-xs text-blue-700">
              Location: {selectedLocation.lat}, {selectedLocation.lon}
            </p>
          )}
          {weatherData && (
            <p className="text-xs text-blue-700">
              Weather data: {weatherData.summary.weatherType.type}, Average temperature {weatherData.summary.avgTemperature.avgValue}°C
            </p>
          )}
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-700">❌ {error}</p>
        </div>
      )}

      {/* Answer area */}
      {answer && (
        <div className="space-y-3">
          <div className="p-4 bg-gray-50 rounded-md">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                AI
              </div>
              <div className="flex-1">
                <p className="text-gray-900 whitespace-pre-wrap">{answer}</p>
              </div>
            </div>
          </div>

          {/* Metadata */}
          <div className="flex flex-wrap gap-4 text-xs text-gray-500">
            {confidence !== null && (
              <div className="flex items-center gap-1">
                <span>Confidence:</span>
                <span className={`font-medium ${
                  confidence > 0.8 ? 'text-green-600' : 
                  confidence > 0.6 ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {Math.round(confidence * 100)}%
                </span>
              </div>
            )}
            {sources.length > 0 && (
              <div className="flex items-center gap-1">
                <span>Data sources:</span>
                <span className="font-medium">{sources.join(', ')}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Usage tips */}
      {!answer && !loading && (
        <div className="text-sm text-gray-500">
          <p className="mb-2">💡 Usage tips:</p>
          <ul className="list-disc list-inside space-y-1 text-xs">
            <li>Ask about weather conditions, climate characteristics, or weather advice</li>
            <li>Combine with current selected location and weather data for more accurate answers</li>
            <li>Supports both English and Chinese questions</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default WeatherAssistant;
