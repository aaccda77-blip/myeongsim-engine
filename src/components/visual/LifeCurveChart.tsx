"use client";

import React, { useMemo, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, ReferenceArea } from 'recharts';
import { LifeCycleEngine } from '@/lib/saju/LifeCycleEngine';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
    onSelectAge: (age: number, score: number) => void;
    birthDate?: Date;
}

// Custom Tooltip for Premium Look
const PremiumTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        const score = payload[0].value;
        const emoji = score >= 80 ? '🌟' : score >= 60 ? '✨' : score >= 40 ? '🌙' : '💫';
        const period = score >= 80 ? '황금기' : score >= 60 ? '성장기' : score >= 40 ? '안정기' : '준비기';

        return (
            <div className="bg-black/80 backdrop-blur-xl border border-white/20 rounded-xl px-4 py-3 shadow-2xl">
                <p className="text-purple-400 font-bold text-lg">{label}세</p>
                <p className="text-white text-2xl font-black">{Math.round(score)}점</p>
                <p className="text-gray-400 text-xs mt-1">{emoji} {period}</p>
            </div>
        );
    }
    return null;
};

export default function LifeCurveChart({ onSelectAge, birthDate }: Props) {
    const [hoveredAge, setHoveredAge] = useState<number | null>(null);

    const { data, goldenPeriods, currentAge } = useMemo(() => {
        const actualDate = birthDate || new Date('1990-01-01');
        const chartData = LifeCycleEngine.calculate(actualDate).chartData;

        // Find golden periods (score >= 75)
        const golden: { start: number; end: number }[] = [];
        let inGolden = false;
        let goldenStart = 0;

        chartData.forEach((d: any, i: number) => {
            if (d.score >= 75 && !inGolden) {
                inGolden = true;
                goldenStart = d.age;
            } else if (d.score < 75 && inGolden) {
                inGolden = false;
                golden.push({ start: goldenStart, end: chartData[i - 1]?.age || d.age });
            }
        });
        if (inGolden) golden.push({ start: goldenStart, end: chartData[chartData.length - 1].age });

        // Calculate current age
        const today = new Date();
        const birth = actualDate;
        const age = today.getFullYear() - birth.getFullYear();

        return { data: chartData, goldenPeriods: golden, currentAge: age };
    }, [birthDate]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full relative"
        >
            {/* Glassmorphic Container */}
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-4 shadow-2xl">
                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <h3 className="text-white font-bold text-base flex items-center gap-2">
                            📈 운명의 파동
                        </h3>
                        <p className="text-gray-500 text-xs">터치하여 시기별 운세 확인</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="bg-yellow-500/20 px-2 py-1 rounded-full text-[10px] text-yellow-400 border border-yellow-500/30 flex items-center gap-1">
                            <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
                            황금기
                        </div>
                        <div className="bg-purple-500/20 px-2 py-1 rounded-full text-[10px] text-purple-300 border border-purple-500/30">
                            현재 {currentAge}세
                        </div>
                    </div>
                </div>

                {/* Chart */}
                <div className="h-[220px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                            data={data}
                            margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
                            onClick={(e: any) => {
                                if (e && e.activePayload && e.activePayload[0]) {
                                    const p = e.activePayload[0].payload;
                                    onSelectAge(p.age, p.score);
                                }
                            }}
                        >
                            <defs>
                                {/* Premium Gradient */}
                                <linearGradient id="premiumGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#8B5CF6" stopOpacity={0.6} />
                                    <stop offset="50%" stopColor="#6366F1" stopOpacity={0.3} />
                                    <stop offset="100%" stopColor="#3B82F6" stopOpacity={0.05} />
                                </linearGradient>
                                {/* Glow Effect */}
                                <filter id="glow">
                                    <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                                    <feMerge>
                                        <feMergeNode in="coloredBlur" />
                                        <feMergeNode in="SourceGraphic" />
                                    </feMerge>
                                </filter>
                            </defs>

                            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" />

                            {/* Golden Period Highlight Zones */}
                            {goldenPeriods.map((period, idx) => (
                                <ReferenceArea
                                    key={idx}
                                    x1={period.start}
                                    x2={period.end}
                                    fill="#FCD34D"
                                    fillOpacity={0.1}
                                    stroke="#FCD34D"
                                    strokeOpacity={0.3}
                                />
                            ))}

                            {/* Current Age Line */}
                            <ReferenceLine
                                x={currentAge}
                                stroke="#10B981"
                                strokeWidth={2}
                                strokeDasharray="5 5"
                                label={{ value: '현재', position: 'top', fill: '#10B981', fontSize: 10 }}
                            />

                            <XAxis
                                dataKey="age"
                                tick={{ fill: '#6B7280', fontSize: 9 }}
                                interval={9}
                                axisLine={{ stroke: '#ffffff10' }}
                                tickLine={{ stroke: '#ffffff10' }}
                            />
                            <YAxis hide domain={[0, 100]} />

                            <Tooltip content={<PremiumTooltip />} />

                            {/* Main Area */}
                            <Area
                                type="monotone"
                                dataKey="score"
                                stroke="#8B5CF6"
                                strokeWidth={2}
                                fillOpacity={1}
                                fill="url(#premiumGradient)"
                                activeDot={{
                                    r: 8,
                                    fill: '#fff',
                                    stroke: '#8B5CF6',
                                    strokeWidth: 3,
                                    filter: 'url(#glow)'
                                }}
                            />

                            {/* 50 Line */}
                            <ReferenceLine y={50} stroke="#ffffff15" strokeDasharray="3 3" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* Legend */}
                <div className="flex justify-center gap-4 mt-3 text-[10px] text-gray-500">
                    <span className="flex items-center gap-1">
                        <span className="w-3 h-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded" />
                        운세 흐름
                    </span>
                    <span className="flex items-center gap-1">
                        <span className="w-3 h-3 bg-yellow-500/30 border border-yellow-500/50 rounded" />
                        황금기
                    </span>
                    <span className="flex items-center gap-1">
                        <span className="w-3 h-1 bg-emerald-500 rounded" />
                        현재
                    </span>
                </div>
            </div>
        </motion.div>
    );
}
