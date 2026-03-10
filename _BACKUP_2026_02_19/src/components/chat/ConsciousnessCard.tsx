import React from 'react';
import { motion } from 'framer-motion';
import { Zap, TrendingUp, AlertTriangle } from 'lucide-react';

interface ConsciousnessCardProps {
    level: string; // e.g., "Level 2: 생존 모드"
    advice: string; // e.g., "지금 너무 결과에 집착하고 있어요. 호흡을 한 번 하세요."
}

export default function ConsciousnessCard({ level, advice }: ConsciousnessCardProps) {
    // Determine color/icon based on level (Simple heuristic)
    const isLowLevel = level.includes('1') || level.includes('2') || level.includes('3');
    const borderColor = isLowLevel ? 'border-red-500/50' : 'border-emerald-500/50';
    const bgColor = isLowLevel ? 'from-red-950/80' : 'from-emerald-950/80';
    const icon = isLowLevel ? <AlertTriangle className="w-5 h-5 text-red-400" /> : <Zap className="w-5 h-5 text-emerald-400" />;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className={`w-full max-w-sm mt-4 mx-auto overflow-hidden rounded-xl border ${borderColor} bg-gradient-to-br ${bgColor} to-black shadow-[0_0_30px_rgba(0,0,0,0.5)] relative`}
        >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-black/40 border-b border-white/10">
                <div className="flex items-center gap-2">
                    {icon}
                    <span className="font-bold text-white text-sm tracking-wider">무의식 주파수 감지</span>
                </div>
                <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
                    <span className="text-[10px] text-gray-400 uppercase">Real-time Analysis</span>
                </div>
            </div>

            {/* Content */}
            <div className="p-5 flex flex-col items-center text-center">
                {/* Visualizer (Fake Bars) */}
                <div className="flex items-end gap-1 h-12 mb-4 opacity-70">
                    {[...Array(7)].map((_, i) => (
                        <motion.div
                            key={i}
                            animate={{ height: [10, 30, 15, 40, 20] }}
                            transition={{ repeat: Infinity, duration: 1 + i * 0.1, ease: "easeInOut" }}
                            className={`w-2 rounded-t-full ${isLowLevel ? 'bg-red-500' : 'bg-emerald-500'}`}
                        />
                    ))}
                </div>

                <h3 className={`text-xl font-bold mb-2 ${isLowLevel ? 'text-red-300' : 'text-emerald-300'}`}>
                    {level}
                </h3>

                <p className="text-gray-300 text-sm leading-relaxed mb-4 break-keep">
                    "{advice}"
                </p>

                <div className="w-full bg-white/5 rounded-lg p-3 flex items-center justify-center gap-2 border border-white/5">
                    <TrendingUp className="w-4 h-4 text-primary-gold" />
                    <span className="text-xs text-primary-gold font-medium">주파수 높이는 솔루션 +1</span>
                </div>
            </div>

            {/* Scanline Effect */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent pointer-events-none animate-scanline"></div>
        </motion.div>
    );
}
