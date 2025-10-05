import React from 'react';
import GlassCard from './GlassCard';
import type { ProbabilityCardProps } from '../types';

const ProbabilityCard: React.FC<ProbabilityCardProps> = ({ title, value, probability, icon }) => {
  // 轉換成數字方便控制 bar 寬度
  const probValue = parseInt(probability.replace('%', '')) || 0;

  return (
    <GlassCard className="p-4 bg-white/20 backdrop-blur-2xl border border-white/40 text-yellow-50 shadow-[0_4px_30px_rgba(255,255,255,0.2)] hover:bg-white/30 transition-all">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-yellow-100 drop-shadow-[0_0_5px_rgba(255,255,200,0.6)]">{title}</h3>
        <div className="text-3xl">{icon}</div>
      </div>

      <div className="space-y-2">
        <div className="text-3xl font-bold text-yellow-50">{value}</div>
        <div className="text-lg font-semibold text-yellow-200/80">{probability}</div>
      </div>

      <div className="mt-4 bg-yellow-100/20 rounded-full h-2 overflow-hidden">
        <div
          className="h-2 bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-500 rounded-full shadow-[0_0_8px_rgba(255,255,200,0.6)] transition-all duration-500"
          style={{ width: `${probValue}%` }}
        ></div>
      </div>
    </GlassCard>
  );
};

export default ProbabilityCard;