import React from 'react';
import type { ProbabilityCardProps } from '../types';

const ProbabilityCard: React.FC<ProbabilityCardProps> = ({
  title,
  value,
  probability,
  icon,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        <div className="text-3xl">{icon}</div>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-blue-600">{value}</span>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Probability:</span>
          <span className="text-lg font-semibold text-green-600">{probability}</span>
        </div>
      </div>
      
      {/* Progress bar */}
      <div className="mt-4">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-blue-400 to-blue-600 h-2 rounded-full transition-all duration-500"
            style={{ 
              width: `${parseInt(probability.replace('%', ''))}%` 
            }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default ProbabilityCard;
