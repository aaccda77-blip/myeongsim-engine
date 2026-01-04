'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
    Radar,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    ResponsiveContainer,
    Legend,
    Tooltip
} from 'recharts';
import { ForceFieldData } from '@/types/genius-report';

interface GeniusForceFieldProps {
    data: ForceFieldData;
}

// 커스텀 틱 렌더러
const CustomTick = ({ payload, x, y, cx, cy }: any) => {
    const offsetX = (x - cx) * 0.15;
    const offsetY = (y - cy) * 0.15;

    return (
        <text
            x={x + offsetX}
            y={y + offsetY}
            fill="#9CA3AF"
            textAnchor="middle"
            dominantBaseline="middle"
            className="text-[10px] md:text-xs font-medium"
            style={{ filter: 'drop-shadow(0 0 3px rgba(0,0,0,0.8))' }}
        >
            {payload.value}
        </text>
    );
};

// 커스텀 툴팁
const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-black/90 backdrop-blur-md border border-white/10 rounded-lg p-3 shadow-xl">
                <p className="text-white font-bold text-sm mb-1">{payload[0]?.payload?.axis}</p>
                <div className="space-y-1 text-xs">
                    <p className="text-orange-400">
                        외부 표출: <span className="font-mono font-bold">{payload[0]?.value?.toFixed(0)}</span>
                    </p>
                    {payload[1] && (
                        <p className="text-blue-400">
                            내면 인식: <span className="font-mono font-bold">{payload[1]?.value?.toFixed(0)}</span>
                        </p>
                    )}
                </div>
            </div>
        );
    }
    return null;
};

export default function GeniusForceField({ data }: GeniusForceFieldProps) {
    // 차트 데이터 변환
    const chartData = data.axisLabels.map((label, idx) => ({
        axis: label,
        outward: data.outward[idx],
        inward: data.inward[idx],
    }));

    return (
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 relative overflow-hidden">
            {/* Decorative Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-amber-500/10 rounded-full blur-[80px] pointer-events-none" />

            {/* Header */}
            <div className="relative z-10 mb-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    🕸️ MY GENIUS FORCE FIELD
                </h3>
                <p className="text-xs text-gray-400 mt-1">나의 에너지 흐름을 8가지 축으로 시각화합니다</p>
            </div>

            {/* Legend */}
            <div className="flex justify-center gap-6 mb-4 text-xs">
                <div className="flex items-center gap-2">
                    <span className="w-3 h-0.5 bg-orange-500 rounded-full" />
                    <span className="text-gray-400">외부 표출 (Outward)</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-3 h-0.5 bg-blue-500 rounded-full" />
                    <span className="text-gray-400">내면 인식 (Inward)</span>
                </div>
            </div>

            {/* Radar Chart */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                className="h-[350px] md:h-[400px] relative z-10"
            >
                <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
                        {/* 배경 그리드 */}
                        <PolarGrid
                            stroke="#374151"
                            strokeDasharray="3 3"
                            strokeOpacity={0.5}
                        />

                        {/* 축 라벨 */}
                        <PolarAngleAxis
                            dataKey="axis"
                            tick={<CustomTick />}
                        />

                        <PolarRadiusAxis
                            angle={90}
                            domain={[0, 100]}
                            tick={false}
                            axisLine={false}
                        />

                        {/* 외부 표출 에너지 (주황) */}
                        <Radar
                            name="Outward"
                            dataKey="outward"
                            stroke="#F97316"
                            strokeWidth={2.5}
                            fill="#F97316"
                            fillOpacity={0.2}
                            isAnimationActive={true}
                            animationDuration={1500}
                            animationEasing="ease-out"
                        />

                        {/* 내면 수용 에너지 (파랑) */}
                        <Radar
                            name="Inward"
                            dataKey="inward"
                            stroke="#3B82F6"
                            strokeWidth={2.5}
                            fill="#3B82F6"
                            fillOpacity={0.15}
                            isAnimationActive={true}
                            animationDuration={1800}
                            animationEasing="ease-out"
                        />

                        <Tooltip content={<CustomTooltip />} />
                    </RadarChart>
                </ResponsiveContainer>
            </motion.div>

            {/* Footer Note */}
            <p className="text-center text-xs text-gray-500 mt-4 relative z-10">
                * 주황선이 파랑선보다 바깥에 있을수록 외향적 에너지가 강합니다
            </p>
        </div>
    );
}
