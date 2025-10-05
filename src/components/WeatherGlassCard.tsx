import React from "react";
import { motion } from "framer-motion";

interface WeatherGlassCardProps {
  type: string; // e.g. "Hot", "Cold", "Humid", ...
  className?: string;
  children: React.ReactNode;
  style?: React.CSSProperties; // ✅ 新增這行
}

const WeatherGlassCard: React.FC<WeatherGlassCardProps> = ({
  type,
  className = "",
  children,
  style, // ✅ 解構 style
}) => {
  const getWeatherStyle = (t: string) => {
    switch (t) {
      case "Hot":
        return {
          gradient: "from-orange-500/70 via-red-500/60 to-red-600/50",
          text: "text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.4)]",
          border: "border-red-200/30",
        };
      case "Cold":
        return {
          gradient: "from-blue-400/70 via-cyan-500/60 to-sky-600/50",
          text: "text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.4)]",
          border: "border-blue-200/30",
        };
      case "Humid":
        return {
          gradient: "from-teal-400/60 via-emerald-400/50 to-green-500/40",
          text: "text-gray-900 drop-shadow-[0_1px_2px_rgba(255,255,255,0.6)]",
          border: "border-teal-100/30",
        };
      case "Windy":
        return {
          gradient: "from-blue-300/60 via-indigo-400/50 to-cyan-400/40",
          text: "text-gray-900 drop-shadow-[0_1px_2px_rgba(255,255,255,0.6)]",
          border: "border-blue-100/30",
        };
      case "Muggy":
        return {
          gradient: "from-yellow-400/60 via-orange-400/50 to-pink-400/40",
          text: "text-gray-900 drop-shadow-[0_1px_2px_rgba(255,255,255,0.7)]",
          border: "border-yellow-200/30",
        };
      case "Comfortable":
        return {
          gradient: "from-green-300/60 via-emerald-400/50 to-teal-400/40",
          text: "text-gray-900 drop-shadow-[0_1px_2px_rgba(255,255,255,0.6)]",
          border: "border-green-100/40",
        };
      default:
        return {
          gradient: "from-gray-300/50 to-gray-400/30",
          text: "text-gray-800",
          border: "border-gray-200/30",
        };
    }
  };

  const styleSet = getWeatherStyle(type);

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 200, damping: 18 }}
      className={`relative overflow-hidden rounded-2xl p-6 border ${styleSet.border} backdrop-blur-xl
      bg-gradient-to-br ${styleSet.gradient} shadow-[0_8px_30px_rgba(0,0,0,0.15)] ${styleSet.text} ${className}`}
      style={style} // ✅ 新增這行：允許外部傳入 style
    >
      {/* 光暈層 */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none rounded-2xl" />
      {/* 主要內容 */}
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
};

export default WeatherGlassCard;