'use client';

import { motion } from 'framer-motion';
import { useMemo } from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

/**
 * EnergyDonutChart - 오행 에너지 도넛 차트
 * 
 * 용도: 에너지 비율을 간결하게 시각화 (요약용)
 * 디자인: 도넛 형태 + 중앙 텍스트
 */

interface EnergyDonutProps {
    energies?: {
        name: string;
        value: number;
        color: string;
    }[];
    centerText?: string;
    size?: 'sm' | 'md' | 'lg';
}

// 오행 기본 데이터
const DEFAULT_ENERGIES = [
    { name: '목(Wood)', value: 25, color: '#10B981' },
    { name: '화(Fire)', value: 20, color: '#EF4444' },
    { name: '토(Earth)', value: 18, color: '#F59E0B' },
    { name: '금(Metal)', value: 22, color: '#9CA3AF' },
    { name: '수(Water)', value: 15, color: '#3B82F6' },
];

const SIZE_MAP = {
    sm: { height: 120, innerRadius: 35, outerRadius: 50 },
    md: { height: 160, innerRadius: 45, outerRadius: 65 },
    lg: { height: 200, innerRadius: 55, outerRadius: 80 },
};

// 커스텀 툴팁
const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        return (
            <div className="bg-deep-slate/95 border border-white/10 p-2 rounded-lg shadow-xl backdrop-blur-md">
                <p className="text-white font-bold text-xs">{data.name}</p>
                <p className="text-gray-400 text-xs">{data.value}%</p>
            </div>
        );
    }
    return null;
};

export default function EnergyDonutChart({
    energies = DEFAULT_ENERGIES,
    centerText = '오행',
    size = 'md'
}: EnergyDonutProps) {
    const chartData = useMemo(() => energies, [energies]);
    const dimensions = SIZE_MAP[size];

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="relative"
            style={{ height: dimensions.height, width: dimensions.height }}
        >
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={dimensions.innerRadius}
                        outerRadius={dimensions.outerRadius}
                        paddingAngle={2}
                        dataKey="value"
                        isAnimationActive={true}
                        animationDuration={1000}
                    >
                        {chartData.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={entry.color}
                                style={{ filter: 'drop-shadow(0 0 4px rgba(0,0,0,0.3))' }}
                            />
                        ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                </PieChart>
            </ResponsiveContainer>

            {/* 중앙 텍스트 */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="text-white font-bold text-xs">{centerText}</span>
            </div>
        </motion.div>
    );
}
