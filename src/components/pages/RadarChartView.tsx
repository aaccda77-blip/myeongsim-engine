'use client';

import { useReportStore } from '@/store/useReportStore';
import { motion } from 'framer-motion';
import { useMemo } from 'react';
import { PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart, ResponsiveContainer, Tooltip, TooltipProps } from 'recharts';

// [Deep Tech] 1. 타입 정의 (Recharts 호환)
interface CustomTickProps {
    payload: {
        value: string;
    };
    x: number;
    y: number;
    cx: number;
    cy: number;
    textAnchor?: string;
    stroke?: string;
}

// 오행 컬러 매핑
const ELEMENT_COLORS: Record<string, string> = {
    '목(Wood)': '#10B981',
    '화(Fire)': '#EF4444',
    '토(Earth)': '#F59E0B',
    '금(Metal)': '#9CA3AF',
    '수(Water)': '#3B82F6',
};

// [Deep Tech] 2. 커스텀 틱 렌더러 (타입 안전)
const CustomTick = ({ payload, x, y, cx, cy, ...rest }: any) => {
    const color = ELEMENT_COLORS[payload.value] || '#cbd5e1';

    // 위치 보정 로직 (중심축에서 조금 더 멀어지게 하여 겹침 방지)
    return (
        <text
            {...rest}
            y={y + (y - cy) / 8}
            x={x + (x - cx) / 8}
            fill={color}
            textAnchor="middle"
            alignmentBaseline="middle"
            className="text-[10px] md:text-xs font-bold font-sans tracking-tighter"
            style={{ filter: 'drop-shadow(0px 0px 4px rgba(0,0,0,0.9))' }} // 가독성 강화
        >
            {payload.value}
        </text>
    );
};

// [Deep Tech] 3. 커스텀 툴팁 (타입 안전)
const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
        const data = payload[0];
        return (
            <div className="bg-deep-slate/95 border border-primary-olive/30 p-3 rounded-lg shadow-2xl backdrop-blur-md">
                <p className="text-primary-olive font-bold text-xs mb-1 tracking-widest uppercase">Energy Score</p>
                <div className="flex items-center gap-2">
                    <span
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: ELEMENT_COLORS[data.payload.subject] || '#fff' }}
                    />
                    <p className="text-white text-sm">
                        {data.payload.subject}: <span className="font-mono font-bold text-white ml-1">{data.value}</span>
                        <span className="text-gray-500 text-xs ml-0.5">/100</span>
                    </p>
                </div>
            </div>
        );
    }
    return null;
};

export default function RadarChartView() {
    const { reportData } = useReportStore();

    // [Fix 1] 데이터 가드 (Empty State)
    if (!reportData) {
        return (
            <div className="h-full flex items-center justify-center">
                <p className="text-gray-500 animate-pulse text-sm">데이터를 분석 중입니다...</p>
            </div>
        );
    }

    const { saju } = reportData;
    const { elements, keywords } = saju;

    // [Fix 2] useMemo를 통한 데이터 캐싱 (불필요한 연산 방지)
    const chartData = useMemo(() => [
        { subject: '목(Wood)', A: elements.wood || 0, fullMark: 100 },
        { subject: '화(Fire)', A: elements.fire || 0, fullMark: 100 },
        { subject: '토(Earth)', A: elements.earth || 0, fullMark: 100 },
        { subject: '금(Metal)', A: elements.metal || 0, fullMark: 100 },
        { subject: '수(Water)', A: elements.water || 0, fullMark: 100 },
    ], [elements]);

    return (
        <section className="h-full flex flex-col items-center justify-center relative -mt-4">

            {/* Background Aura */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-primary-olive/5 rounded-full blur-[80px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                className="text-center w-full max-w-md z-10"
            >
                {/* Header */}
                <div className="mb-6">
                    <span className="text-xs text-primary-olive font-bold tracking-widest uppercase border border-primary-olive/30 px-3 py-1 rounded-full bg-primary-olive/10">
                        Part 1. Energy Balance
                    </span>
                    <h2 className="text-2xl md:text-3xl font-serif font-bold text-white mt-4 mb-2">나의 오행 에너지</h2>
                    <p className="text-sm text-gray-400">오행(Five Elements)의 균형을 분석합니다.</p>
                </div>

                {/* Chart Container */}
                <div className="h-[300px] md:h-[380px] w-full flex justify-center mb-6 relative px-2">
                    <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="75%" data={chartData}>
                            <PolarGrid stroke="#374151" strokeDasharray="3 3" />

                            <PolarAngleAxis
                                dataKey="subject"
                                tick={(props) => <CustomTick {...props} />}
                            />

                            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />

                            <Radar
                                name="My Energy"
                                dataKey="A"
                                stroke="#658c42"
                                strokeWidth={3}
                                fill="#658c42"
                                fillOpacity={0.4}
                                isAnimationActive={true}
                                animationDuration={1500}
                                animationEasing="ease-out"
                            />
                            <Tooltip content={<CustomTooltip />} cursor={false} />
                        </RadarChart>
                    </ResponsiveContainer>
                </div>

                {/* Keywords Chips */}
                <div className="flex flex-wrap justify-center gap-2 md:gap-3 px-4">
                    {(keywords || []).map((keyword, idx) => (
                        <motion.span
                            key={idx}
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 + (idx * 0.1) }}
                            className="px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-xs md:text-sm text-gray-300 backdrop-blur-sm shadow-sm hover:bg-primary-olive/20 transition-colors cursor-default"
                        >
                            #{keyword}
                        </motion.span>
                    ))}
                </div>
            </motion.div>
        </section>
    );
}
