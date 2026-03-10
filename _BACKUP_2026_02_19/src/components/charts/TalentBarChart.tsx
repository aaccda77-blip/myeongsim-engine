'use client';

import { motion } from 'framer-motion';
import { useMemo } from 'react';
import { Bar, BarChart, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';

/**
 * TalentBarChart - 재능 프로파일 막대 그래프
 * 
 * 용도: Pearl Sequence(재물운) 상세 페이지에서 재능 분포 시각화
 * 디자인: 가로 막대 그래프 + 그라데이션 컬러
 */

interface TalentBarProps {
    talents?: {
        name: string;
        value: number;
        color?: string;
    }[];
    title?: string;
}

// 기본 재능 데이터
const DEFAULT_TALENTS = [
    { name: '분석력', value: 85, color: '#10B981' },
    { name: '창작력', value: 72, color: '#3B82F6' },
    { name: '협상력', value: 68, color: '#8B5CF6' },
    { name: '기획력', value: 90, color: '#F59E0B' },
    { name: '실행력', value: 78, color: '#EF4444' },
];

// 커스텀 툴팁
const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        return (
            <div className="bg-deep-slate/95 border border-white/10 p-3 rounded-lg shadow-xl backdrop-blur-md">
                <p className="text-white font-bold text-sm">{data.name}</p>
                <p className="text-gray-400 text-xs mt-1">
                    점수: <span className="text-emerald-400 font-mono">{data.value}</span>/100
                </p>
            </div>
        );
    }
    return null;
};

export default function TalentBarChart({ talents = DEFAULT_TALENTS, title = '재능 프로파일' }: TalentBarProps) {
    const chartData = useMemo(() => talents, [talents]);

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full"
        >
            {/* 타이틀 */}
            <h3 className="text-white text-sm font-semibold mb-3 flex items-center gap-2">
                <span className="text-emerald-400">📊</span>
                {title}
            </h3>

            {/* 막대 그래프 */}
            <div className="h-[180px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        layout="vertical"
                        data={chartData}
                        margin={{ top: 5, right: 30, left: 60, bottom: 5 }}
                    >
                        <XAxis type="number" domain={[0, 100]} tick={{ fill: '#9CA3AF', fontSize: 10 }} />
                        <YAxis
                            dataKey="name"
                            type="category"
                            tick={{ fill: '#D1D5DB', fontSize: 11, fontWeight: 500 }}
                            width={55}
                        />
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
                        <Bar
                            dataKey="value"
                            radius={[0, 4, 4, 0]}
                            isAnimationActive={true}
                            animationDuration={800}
                        >
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color || '#10B981'} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </motion.div>
    );
}
