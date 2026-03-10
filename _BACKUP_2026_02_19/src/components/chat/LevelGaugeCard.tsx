'use client';

import React, { useEffect, useState } from 'react';
import { motion, useSpring } from 'framer-motion';
import { ConsciousnessEngine } from '@/components/features/ConsciousnessEngine';

interface LevelGaugeCardProps {
    innateLevel: number;
    currentLevel: number;
    framework?: string;
    tip?: string;
}

export default function LevelGaugeCard({
    innateLevel = 125, // [Realism] Default to 'Desire/Discovery'
    currentLevel = 155, // [Realism] Slightly higher 'Anger/Action' energy
    framework = "Integrated Analysis",
    tip
}: LevelGaugeCardProps) {
    // [Living UI] Spring Animation for dynamic number counting
    const springValue = useSpring(0, { stiffness: 50, damping: 15 });
    const [displayLevel, setDisplayLevel] = useState(0);

    // [Living UI] Calculate dynamic width percentage (Max scale 800)
    const maxScale = 800;
    const innatePercent = Math.min((innateLevel / maxScale) * 100, 100);
    const currentPercent = Math.min((currentLevel / maxScale) * 100, 100);
    const growth = currentLevel - innateLevel;

    useEffect(() => {
        springValue.set(currentLevel);
    }, [currentLevel, springValue]);

    useEffect(() => {
        return springValue.onChange((latest) => {
            setDisplayLevel(Math.floor(latest));
        });
    }, [springValue]);

    // Badge Logic - Dynamic Color based on Level
    const getBadgeInfo = (score: number) => {
        if (score < 200) return { color: '#ef4444', label: '탐색 (Seeking)', glow: 'rgba(239, 68, 68, 0.4)' };
        if (score < 350) return { color: '#f59e0b', label: '도약 (Leaping)', glow: 'rgba(245, 158, 11, 0.4)' };
        if (score < 500) return { color: '#10b981', label: '통찰 (Insight)', glow: 'rgba(16, 185, 129, 0.4)' };
        if (score < 600) return { color: '#3b82f6', label: '조화 (Harmony)', glow: 'rgba(59, 130, 246, 0.4)' };
        return { color: '#8b5cf6', label: '몰입 (Flow)', glow: 'rgba(139, 92, 246, 0.4)' };
    };

    const badgeInfo = getBadgeInfo(displayLevel);

    return (
        <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="font-sans bg-[#151922] rounded-xl p-0 w-full max-w-[320px] border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)] relative overflow-hidden flex text-left mb-2 group"
        >
            {/* [Ambient Glow] */}
            <div
                className="absolute -top-10 -right-10 w-32 h-32 rounded-full blur-[50px] opacity-20 transition-colors duration-1000"
                style={{ backgroundColor: badgeInfo.color }}
            />

            {/* Engine Mark */}
            <div className="absolute top-2 right-3 text-[8px] text-white/15 font-extrabold uppercase tracking-[0.5px] pointer-events-none z-10 flex items-center gap-1">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    className="w-2 h-2 border border-dashed border-white/20 rounded-full"
                />
                코어 다이내믹스 엔진™
            </div>

            {/* Sidebar */}
            <div className="bg-white/[0.02] border-r border-white/5 p-[15px_10px] flex flex-col items-center justify-center text-[#8b95a1] relative">
                <motion.div
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="text-base mb-2 relative z-10"
                >
                    📡
                </motion.div>
                {/* Scanner Line */}
                <motion.div
                    animate={{ y: [-20, 40, -20] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    className="absolute w-full h-[2px] bg-primary-gold/20 top-[30px] shadow-[0_0_10px_rgba(212,175,55,0.5)]"
                />
                <span
                    className="text-[10px] font-semibold tracking-[2px] text-white/40"
                    style={{ writingMode: 'vertical-rl', textOrientation: 'upright' }}
                >
                    의식레벨측정
                </span>
            </div>

            {/* Content */}
            <div className="flex-1 p-[20px_15px_15px_15px] flex flex-col relative z-10 bg-gradient-to-r from-[#151922] to-transparent">

                {/* Top Section */}
                <div className="flex items-center gap-4 mb-[15px] mt-[5px]">
                    {/* [Living Engine] Replaced static SVG with Dynamic Engine */}
                    <div className="shrink-0 relative scale-90">
                        <ConsciousnessEngine
                            baseLevel={springValue.get()} // Live Spring Value
                            trend={growth > 0 ? 'up' : growth < 0 ? 'down' : 'stable'}
                            size="md"
                        />
                    </div>

                    <div className="flex flex-col flex-1">
                        <div className="text-[15px] font-bold text-white mb-[4px] flex items-center gap-2">
                            {growth > 0 ? (
                                <span className="text-green-400 flex items-center gap-1 animate-pulse">
                                    상승중 <span className="text-xs">▲ {growth}</span>
                                </span>
                            ) : growth < 0 ? (
                                <span className="text-orange-400 flex items-center gap-1">
                                    에너지 감소 <span className="text-xs">▼ {Math.abs(growth)}</span>
                                </span>
                            ) : (
                                <span className="text-gray-400">상태 유지 😐</span>
                            )}
                        </div>
                        <div className="text-[10px] text-gray-400 leading-[1.3] tracking-[0.2px] border-l-2 border-white/10 pl-2">
                            현재 의식 상태가 <br />
                            <span className="text-white font-bold">{badgeInfo.label} 단계</span>에 있습니다.
                        </div>
                    </div>
                </div>

                {/* Gap Visualizer (Dynamic Bar) */}
                <div className="flex items-center justify-between mb-[6px] relative h-[14px] mt-1 select-none">
                    {/* Labels */}
                    <div className="absolute -top-4 w-full flex justify-between px-1">
                        <span className="text-[8px] text-cyan-400/70 font-bold uppercase tracking-wider">Innate (선천)</span>
                        <span className="text-[8px] text-green-400/70 font-bold uppercase tracking-wider">Acquired (후천)</span>
                    </div>

                    {/* Track */}
                    <div className="w-full h-[6px] bg-[#1e232f] rounded-full overflow-hidden relative shadow-inner">
                        {/* Fill Animation */}
                        <motion.div
                            className="h-full rounded-full relative"
                            style={{
                                background: `linear-gradient(90deg, #3b82f6 0%, ${badgeInfo.color} 100%)`
                            }}
                            initial={{ width: 0 }}
                            animate={{ width: `${currentPercent}%` }}
                            transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
                        >
                            {/* Shimmer Effect */}
                            <motion.div
                                className="absolute inset-0 bg-white/20 skew-x-[-20deg]"
                                initial={{ x: '-100%' }}
                                animate={{ x: '200%' }}
                                transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                            />
                        </motion.div>

                        {/* Innate Marker (Fixed on Bar) */}
                        <motion.div
                            className="absolute top-0 bottom-0 w-[2px] bg-cyan-400 z-10 shadow-[0_0_8px_rgba(34,211,238,0.8)]"
                            style={{ left: `${innatePercent}%` }}
                            initial={{ opacity: 0, scaleY: 0 }}
                            animate={{ opacity: 1, scaleY: 1 }}
                            transition={{ delay: 1 }}
                        />
                    </div>
                </div>

                {/* Description Box */}
                <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="mt-2 text-[11px] bg-white/5 rounded-lg p-3 border border-white/5 text-gray-300 leading-relaxed font-light"
                >
                    <span className="mr-2 text-base align-middle">💡</span>
                    <span className="align-middle">
                        {tip || "현재 에너지 흐름이 매우 역동적입니다. 작은 변화가 큰 성장을 이끌어낼 수 있는 타이밍입니다."}
                    </span>
                </motion.div>

            </div>
        </motion.div>
    );
}
