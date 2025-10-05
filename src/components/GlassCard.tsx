import React from "react";
import { motion } from "framer-motion";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  blurIntensity?: string;
  opacity?: string;
  borderColor?: string;
}

const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = "",
  blurIntensity = "backdrop-blur-xl",
  opacity = "bg-white/10",
  borderColor = "border-white/20",
}) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 250, damping: 20 }}
      className={`relative overflow-hidden rounded-2xl p-6 shadow-[0_8px_30px_rgba(0,0,0,0.12)] 
        ${blurIntensity} ${opacity} border ${borderColor} ${className}`}
    >
      {/* 光暈層 */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent pointer-events-none rounded-2xl"></div>

      {/* 主要內容 */}
      <div className={`relative z-10 text-gray-900 dark:text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]`}>
        {children}
      </div>
    </motion.div>
  );
};

export default GlassCard;