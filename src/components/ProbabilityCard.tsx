import React from 'react';
import GlassCard from './GlassCard';
import type { ProbabilityCardProps } from '../types';

const ProbabilityCard: React.FC<ProbabilityCardProps> = ({ title, value, probability, icon }) => {
  // 轉換成數字方便控制 bar 寬度
  const probValue = parseInt(probability.replace('%', '')) || 0;

  return (
    <GlassCard className="p-4">
      {/* Title + Icon */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        <div className="text-3xl drop-shadow-[0_1px_2px_rgba(0,0,0,0.25)]">{icon}</div>
      </div>

      {/* Value + Probability */}
      <div className="space-y-2">
        <div className="text-3xl font-bold text-gray-900">{value}</div>
        <div className="text-lg font-semibold text-gray-600">{probability}</div>
      </div>

      {/* Progress bar */}
      <div className="mt-4 bg-gray-200/60 rounded-full h-2">
        <div
          className="h-2 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 transition-all duration-500"
          style={{ width: `${probValue}%` }}
        ></div>
      </div>
    </GlassCard>
  );
};

export default ProbabilityCard;