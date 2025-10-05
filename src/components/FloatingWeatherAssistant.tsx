import React, { useState, useEffect, useRef } from 'react';
import { weatherAssistant } from '../services/weatherAssistant';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import type { Location, WeatherApiResponse } from '../types';

interface FloatingWeatherAssistantProps {
  selectedLocation?: Location;
  weatherData?: WeatherApiResponse;
}

interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  sources?: string[];
}

const FloatingWeatherAssistant: React.FC<FloatingWeatherAssistantProps> = ({ 
  selectedLocation, 
  weatherData 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (weatherData && selectedLocation && !hasInitialized) {
      initializeAI();
      setHasInitialized(true);
    }
  }, [weatherData, selectedLocation, hasInitialized]);

  const initializeAI = async () => {
    if (!weatherData || !selectedLocation) return;

    setLoading(true);
    try {
      const initialQuestion =
        "Please analyze the current weather data and provide insights about the weather conditions, risks, and recommendations for outdoor activities.";
      const response = await weatherAssistant.askWithWeatherData(
        initialQuestion,
        selectedLocation,
        weatherData
      );

      const aiMessage: ChatMessage = {
        id: Date.now().toString(),
        type: 'ai',
        content: response.answer,
        timestamp: new Date(),
        sources: response.sources,
      };

      setMessages([aiMessage]);
    } catch (error) {
      console.error('Failed to initialize AI:', error);
      const errorMessage: ChatMessage = {
        id: Date.now().toString(),
        type: 'ai',
        content:
          "I'm ready to help you with weather analysis! Please ask me any questions about the current weather conditions.",
        timestamp: new Date(),
      };
      setMessages([errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || loading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');
    setLoading(true);

    try {
      let response;

      if (selectedLocation && weatherData) {
        response = await weatherAssistant.askWithWeatherData(
          inputMessage,
          selectedLocation,
          weatherData
        );
      } else if (selectedLocation) {
        response = await weatherAssistant.askWithLocation(
          inputMessage,
          selectedLocation
        );
      } else {
        response = await weatherAssistant.quickAsk(inputMessage);
      }

      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: response.answer,
        timestamp: new Date(),
        sources: response.sources,
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content:
          "Sorry, I encountered an error while processing your question. Please try again.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([]);
    setHasInitialized(false);
    if (weatherData && selectedLocation) {
      initializeAI();
    }
  };

  const toggleAssistant = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* 🤖 機器人按鈕（縮放+動畫切換+不擋輸入框） */}
      <div
        onClick={toggleAssistant}
        className="fixed z-[1000] transition-all duration-500 ease-in-out cursor-pointer"
        style={{
          bottom: isOpen ? '0.5rem' : '10rem',  // ✅ 開啟時再往下貼
          right: isOpen ? '1.5rem' : '2rem',   // ✅ 稍微往右
          transform: isOpen
            ? 'scale(0.4) translateY(160px)'  // ✅ 更小更靠下，不擋 input
            : 'scale(1)',
        }}
        title={isOpen ? 'Close Weather Assistant' : 'Open Weather Assistant'}
      >
        <DotLottieReact
          src={
            isOpen
              ? "https://lottie.host/a77d5c86-ecad-485a-8a11-12001a7977e1/Qw5cDjr3eY.lottie"
              : "https://lottie.host/9090e068-2b9b-4635-b10a-7bef430a488c/TAXCI8dyWW.lottie"
          }
          loop
          autoplay
          style={{
            width: 300,
            height: 300,
            filter: isOpen
              ? 'drop-shadow(0 0 30px rgba(100, 180, 255, 0.9))'
              : 'drop-shadow(0 0 60px rgba(255, 223, 100, 0.9))',
            transition: 'all 0.6s ease',
          }}
        />
      </div>

      {/* 💬 對話窗 */}
      {isOpen && (
        <div className="fixed bottom-36 right-6 z-[999] w-96 h-[500px] bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 flex flex-col overflow-hidden transition-all duration-500 ease-in-out">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-sm font-bold">AI</span>
              </div>
              <div>
                <h3 className="font-semibold">Weather Assistant</h3>
                <p className="text-xs text-blue-100">Powered by AI</p>
              </div>
            </div>
            <button
              onClick={clearChat}
              className="p-1 hover:bg-white/20 rounded-full transition-colors"
              title="Clear Chat"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && !loading && (
              <div className="text-center text-gray-500 text-sm">
                <div className="w-16 h-16 mx-auto mb-3 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-blue-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                </div>
                <p>Ask me anything about the weather!</p>
              </div>
            )}

            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.type === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                    message.type === 'user'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">
                    {message.content}
                  </p>
                  {message.sources && message.sources.length > 0 && (
                    <div className="mt-2 text-xs opacity-75">
                      <span>Sources: {message.sources.join(', ')}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-2xl px-4 py-2">
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                    <span className="text-sm text-gray-600">
                      AI is thinking...
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about the weather..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                disabled={loading}
              />
              <button
                onClick={sendMessage}
                disabled={loading || !inputMessage.trim()}
                className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FloatingWeatherAssistant;