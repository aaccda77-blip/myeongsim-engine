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
import { ForceFieldData } from '@/types/strength-report';

interface StrengthForceFieldProps {
    data: ForceFieldData;
    onItemClick?: (category: 'forceField', itemKey: string, itemLabel: string, itemValue: number) => void;
}

// 커스텀 틱 렌더러
const CustomTick = ({ payload, x, y, cx, cy, onItemClick, chartData }: any) => {
    const offsetX = (x - cx) * 0.15;
    const offsetY = (y - cy) * 0.15;

    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!onItemClick || !chartData || !payload) return;
        const matched = chartData.find((d: any) => d.axis === payload.value);
        if (matched) {
            const avgValue = Math.round((matched.outward + matched.inward) / 2);
            onItemClick('forceField', matched.axis, `본질 에너지: ${matched.axis}`, avgValue);
        }
    };

    return (
        <text
            x={x + offsetX}
            y={y + offsetY}
            fill="#9CA3AF"
            textAnchor="middle"
            dominantBaseline="middle"
            className="text-[10px] md:text-xs font-medium hover:fill-amber-400 transition-colors"
            style={{ filter: 'drop-shadow(0 0 3px rgba(0,0,0,0.8))', cursor: 'pointer' }}
            onClick={handleClick}
        >
            {payload.value}
        </text>
    );
};

// 커스텀 툴팁
const CustomTooltip = ({ active, payload, onItemClick }: any) => {
    if (active && payload && payload.length) {
        const axisName = payload[0]?.payload?.axis;
        const outwardValue = payload[0]?.value;
        const inwardValue = payload[1]?.value;

        const handleTotalClick = (e: React.MouseEvent) => {
            e.stopPropagation();
            if (!onItemClick) return;
            const avgValue = Math.round((outwardValue + (inwardValue || 0)) / 2);
            onItemClick('forceField', axisName, `본질 에너지: ${axisName}`, avgValue);
        };

        const handleOutwardClick = (e: React.MouseEvent) => {
            e.stopPropagation();
            if (!onItemClick) return;
            onItemClick('forceField', `${axisName}_outward`, `본질 에너지: ${axisName} (외부 표출)`, Math.round(outwardValue));
        };

        const handleInwardClick = (e: React.MouseEvent) => {
            e.stopPropagation();
            if (!onItemClick || inwardValue === undefined) return;
            onItemClick('forceField', `${axisName}_inward`, `본질 에너지: ${axisName} (내면 인식)`, Math.round(inwardValue));
        };

        return (
            <div 
                className="bg-black/90 backdrop-blur-md border border-white/10 rounded-lg p-3 shadow-xl cursor-pointer"
                onClick={handleTotalClick}
            >
                <p className="text-white font-bold text-sm mb-1 hover:text-amber-400 hover:underline">{axisName}</p>
                <div className="space-y-1 text-xs">
                    <p 
                        className="text-orange-400 hover:text-orange-300 hover:underline cursor-pointer transition-colors"
                        onClick={handleOutwardClick}
                    >
                        외부 표출: <span className="font-mono font-bold">{outwardValue?.toFixed(0)}</span>
                    </p>
                    {payload[1] && (
                        <p 
                            className="text-blue-400 hover:text-blue-300 hover:underline cursor-pointer transition-colors"
                            onClick={handleInwardClick}
                        >
                            내면 인식: <span className="font-mono font-bold">{inwardValue?.toFixed(0)}</span>
                        </p>
                    )}
                </div>
                <p className="text-[10px] text-amber-400/70 mt-2">👆 항목 클릭 시 개별 AI 상세 해설</p>
            </div>
        );
    }
    return null;
};

export default function StrengthForceField({ data, onItemClick }: StrengthForceFieldProps) {
    // 차트 데이터 변환
    const chartData = data.axisLabels.map((label, idx) => ({
        axis: label,
        outward: data.outward[idx],
        inward: data.inward[idx],
    }));

    // 차트 클릭 핸들러
    const handleChartClick = (chartState: any) => {
        if (!onItemClick || !chartState?.activePayload?.length) return;
        const activeData = chartState.activePayload[0].payload;
        const avgValue = Math.round((activeData.outward + activeData.inward) / 2);
        onItemClick('forceField', activeData.axis, `본질 에너지: ${activeData.axis}`, avgValue);
    };

    return (
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 relative overflow-hidden">
            {/* Decorative Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-amber-500/10 rounded-full blur-[80px] pointer-events-none" />

            {/* Header */}
            <div className="relative z-10 mb-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    🕸️ 본질 에너지 포스필드
                </h3>
                <p className="text-xs text-gray-400 mt-1">나의 에너지 흐름을 8가지 축으로 시각화합니다</p>
            </div>

            {/* Legend */}
            <div className="flex justify-center gap-6 mb-4 text-xs relative z-10">
                <div 
                    className="flex items-center gap-2 cursor-pointer group hover:bg-white/5 px-2 py-1 rounded transition-colors"
                    onClick={() => {
                        if (!onItemClick) return;
                        const avgOutward = Math.round(data.outward.reduce((a, b) => a + b, 0) / data.outward.length);
                        onItemClick('forceField', 'outward_total', '전체 외부 표출 에너지 (Outward)', avgOutward);
                    }}
                >
                    <span className="w-3 h-0.5 bg-orange-500 rounded-full" />
                    <span className="text-gray-400 group-hover:text-white transition-colors">외부 표출 (Outward)</span>
                </div>
                <div 
                    className="flex items-center gap-2 cursor-pointer group hover:bg-white/5 px-2 py-1 rounded transition-colors"
                    onClick={() => {
                        if (!onItemClick) return;
                        const avgInward = Math.round(data.inward.reduce((a, b) => a + b, 0) / data.inward.length);
                        onItemClick('forceField', 'inward_total', '전체 내면 인식 에너지 (Inward)', avgInward);
                    }}
                >
                    <span className="w-3 h-0.5 bg-blue-500 rounded-full" />
                    <span className="text-gray-400 group-hover:text-white transition-colors">내면 인식 (Inward)</span>
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
                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData} onClick={handleChartClick} style={{ cursor: 'pointer' }}>
                        {/* 배경 그리드 */}
                        <PolarGrid
                            stroke="#374151"
                            strokeDasharray="3 3"
                            strokeOpacity={0.5}
                        />

                        {/* 축 라벨 */}
                        <PolarAngleAxis
                            dataKey="axis"
                            tick={<CustomTick onItemClick={onItemClick} chartData={chartData} />}
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

                        <Tooltip content={<CustomTooltip onItemClick={onItemClick} />} wrapperStyle={{ pointerEvents: 'auto' }} />
                    </RadarChart>
                </ResponsiveContainer>
            </motion.div>

            {/* Footer Note */}
            <p className="text-center text-xs text-gray-500 mt-4 relative z-10">
                * 차트의 각 축을 클릭하면 AI가 상세히 분석해드립니다
            </p>
        </div>
    );
}
