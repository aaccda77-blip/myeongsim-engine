'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface LevelGaugeCardProps {
    innateLevel: number;
    currentLevel: number;
    framework?: string;
    tip?: string;
}

export default function LevelGaugeCard({
    innateLevel = 0,
    currentLevel = 0,
    framework = "Integrated Analysis",
    tip
}: LevelGaugeCardProps) {
    const [animatedWidth, setAnimatedWidth] = useState(0);

    useEffect(() => {
        const timer = setTimeout(() => setAnimatedWidth(currentLevel), 100);
        return () => clearTimeout(timer);
    }, [currentLevel]);

    const maxLevel = 1000;
    // const innatePercent = Math.min((innateLevel / maxLevel) * 100, 100);
    // const currentPercent = Math.min((currentLevel / maxLevel) * 100, 100);
    const growth = currentLevel - innateLevel;

    // Badge Logic
    const getBadgeStyle = (score: number) => {
        // Red (>600 is high, but adhering to user design color palette if needed, or sticking to logic)
        // User design has specific colors. Let's try to match the "Dark Navy" theme.
        return 'border-[#e84142] text-[#ff6b6b] shadow-[0_0_10px_rgba(232,65,66,0.2)] bg-[#2a1a20]';
    };

    return (
        <div className="font-sans bg-[#151922] rounded-xl p-0 w-full max-w-[300px] border border-white/10 shadow-[0_4px_12px_rgba(0,0,0,0.3)] relative overflow-hidden flex text-left mb-2">

            {/* Engine Mark */}
            <div className="absolute top-2 right-3 text-[8px] text-white/15 font-extrabold uppercase tracking-[0.5px] pointer-events-none z-10">
                코어 다이내믹스 엔진™
            </div>

            {/* Sidebar */}
            <div className="bg-white/[0.03] border-r border-white/5 p-[15px_10px] flex flex-col items-center justify-center text-[#8b95a1]">
                <span className="text-base mb-2">📡</span>
                <span
                    className="text-[11px] font-semibold tracking-[2px]"
                    style={{ writingMode: 'vertical-rl', textOrientation: 'upright' }}
                >
                    의식레벨측정
                </span>
            </div>

            {/* Content */}
            <div className="flex-1 p-[20px_15px_15px_15px] flex flex-col relative">

                {/* Top Section */}
                <div className="flex items-center gap-3 mb-[15px] mt-[5px]">
                    <div className={`w-[50px] h-[50px] rounded-full flex flex-col justify-center items-center border ${getBadgeStyle(currentLevel)} shrink-0`}>
                        <span className="text-[9px] opacity-80 mb-[2px]">레벨</span>
                        <span className="text-[18px] font-extrabold leading-none">{currentLevel}</span>
                    </div>
                    <div className="flex flex-col flex-1">
                        <div className="text-[16px] font-bold text-white mb-[3px] flex items-center">
                            {growth > 0 ? "상승 🚀" : growth < 0 ? "휴식 💤" : "유지 😐"}
                        </div>
                        <div className="text-[11px] text-[#6c757d] leading-[1.35] tracking-[0.3px]">
                            <span className="text-[#8b95a1] font-bold">NC-06</span><br />
                            기회 (OPPORTUNITY)
                        </div>
                    </div>
                </div>

                {/* Gap Visualizer */}
                <div className="flex items-center justify-between mb-[6px] pr-[2px] relative h-[12px]">
                    <div className="flex items-center gap-1 z-[1] bg-[#151922] px-[4px]">
                        <span className="w-[6px] h-[6px] rounded-full bg-[#00d2ff] shadow-[0_0_5px_rgba(0,210,255,0.4)]"></span>
                        <span className="text-[8px] text-[#666] font-semibold uppercase">선천적</span>
                    </div>
                    {/* Line */}
                    <div className="absolute top-1/2 left-[20px] right-[20px] h-[1px] bg-gradient-to-r from-[#00d2ff] to-[#00ff88] opacity-30 z-0"></div>
                    <div className="flex items-center gap-1 z-[1] bg-[#151922] px-[4px]">
                        <span className="text-[8px] text-[#666] font-semibold uppercase">후천적</span>
                        {/* [Fix] Use Framer Motion for animation instead of custom CSS to avoid styled-jsx issues */}
                        <motion.span
                            animate={{
                                scale: [1, 1.2, 1],
                                boxShadow: [
                                    "0 0 0 0 rgba(0, 255, 136, 0.4)",
                                    "0 0 0 3px rgba(0, 255, 136, 0)",
                                    "0 0 0 0 rgba(0, 255, 136, 0)"
                                ]
                            }}
                            transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                            className="w-[6px] h-[6px] rounded-full bg-[#00ff88]"
                        />
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="flex gap-[3px] h-[6px] mb-[12px] relative">
                    <div className="flex-[1.2] bg-[#ff6b00] rounded-[3px] shadow-[0_0_8px_rgba(255,107,0,0.4)]"></div>
                    <div className="flex-1 bg-[#333a45] rounded-[3px]"></div>
                    <div className="flex-1 bg-[#333a45] rounded-[3px]"></div>
                </div>

                {/* Description */}
                <div className="text-[11px] text-[#a0a0a0] leading-[1.5] tracking-[-0.3px] italic">
                    <span className="not-italic mr-1">💡</span>
                    {tip || "재물 기회 탐색에 대한 구체적인 행동 제안. 의식 레벨은 기회 탐색에 대한 적극성 증가."}
                </div>

            </div>
        </div>
    );
}
