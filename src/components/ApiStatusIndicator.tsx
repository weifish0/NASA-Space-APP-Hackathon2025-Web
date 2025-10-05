import React, { useState, useEffect } from 'react';
import { weatherApi } from '../services/api';

interface ApiStatusIndicatorProps {
  className?: string;
}

const ApiStatusIndicator: React.FC<ApiStatusIndicatorProps> = ({ className = '' }) => {
  const [status, setStatus] = useState<'checking' | 'connected' | 'error'>('checking');
  const [lastCheck, setLastCheck] = useState<Date | null>(null);

  const checkApiStatus = async () => {
    try {
      setStatus('checking');
      await weatherApi.checkHealth();
      setStatus('connected');
      setLastCheck(new Date());
    } catch (error) {
      setStatus('error');
      setLastCheck(new Date());
    }
  };

  useEffect(() => {
    checkApiStatus();
    
    // Check every 30 seconds
    const interval = setInterval(checkApiStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = () => {
    switch (status) {
      case 'connected':
        return 'text-green-600 bg-green-100';
      case 'error':
        return 'text-red-600 bg-red-100';
      case 'checking':
        return 'text-yellow-600 bg-yellow-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'connected':
        return 'API Connected';
      case 'error':
        return 'API Error';
      case 'checking':
        return 'Checking API...';
      default:
        return 'Unknown';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'connected':
        return '✅';
      case 'error':
        return '❌';
      case 'checking':
        return '⏳';
      default:
        return '❓';
    }
  };

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor()} ${className}`}>
      <span className="text-xs">{getStatusIcon()}</span>
      <span>{getStatusText()}</span>
      {lastCheck && (
        <span className="text-xs opacity-75">
          ({lastCheck.toLocaleTimeString()})
        </span>
      )}
      <button
        onClick={checkApiStatus}
        className="ml-1 text-xs opacity-75 hover:opacity-100 transition-opacity"
        title="Refresh API status"
      >
        🔄
      </button>
    </div>
  );
};

export default ApiStatusIndicator;
