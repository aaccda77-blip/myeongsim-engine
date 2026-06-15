'use client';

import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useReportStore } from '@/store/useReportStore';
import dynamic from 'next/dynamic';

// Recharts 동적 임포트 (SSR 방지)
const RadarChart = dynamic(() => import('recharts').then(mod => mod.RadarChart), { ssr: false });
const Radar = dynamic(() => import('recharts').then(mod => mod.Radar), { ssr: false });
const PolarGrid = dynamic(() => import('recharts').then(mod => mod.PolarGrid), { ssr: false });
const PolarAngleAxis = dynamic(() => import('recharts').then(mod => mod.PolarAngleAxis), { ssr: false });
const PolarRadiusAxis = dynamic(() => import('recharts').then(mod => mod.PolarRadiusAxis), { ssr: false });
const ResponsiveContainer = dynamic(() => import('recharts').then(mod => mod.ResponsiveContainer), { ssr: false });
const Tooltip = dynamic(() => import('recharts').then(mod => mod.Tooltip), { ssr: false });

interface OhaengContributionModalProps {
    isOpen: boolean;
    onClose: () => void;
}

// 오행 컬러 매핑 (원본 RadarChartView 그대로 재현)
const ELEMENT_COLORS: Record<string, string> = {
    '목(Wood)': '#10B981',
    '화(Fire)': '#EF4444',
    '토(Earth)': '#F59E0B',
    '금(Metal)': '#9CA3AF',
    '수(Water)': '#3B82F6',
};

// 커스텀 틱 렌더러 (원본 그대로)
const CustomTick = ({ payload, x, y, cx, cy, ...rest }: any) => {
    const color = ELEMENT_COLORS[payload.value] || '#cbd5e1';
    return (
        <text
            {...rest}
            y={y + (y - cy) / 8}
            x={x + (x - cx) / 8}
            fill={color}
            textAnchor="middle"
            alignmentBaseline="middle"
            className="text-[10px] md:text-xs font-bold font-sans tracking-tighter"
            style={{ filter: 'drop-shadow(0px 0px 4px rgba(0,0,0,0.9))' }}
        >
            {payload.value}
        </text>
    );
};

// 커스텀 툴팁 (원본 그대로)
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

export default function OhaengContributionModal({ isOpen, onClose }: OhaengContributionModalProps) {
    const { reportData } = useReportStore();

    const saju = reportData?.saju;
    const elements: any = saju?.elements || {};
    const keywords = saju?.keywords || [];

    // 레이더 차트 데이터 (원본 RadarChartView 그대로)
    const chartData = useMemo(() => [
        { subject: '목(Wood)', A: elements?.wood || 0, fullMark: 100 },
        { subject: '화(Fire)', A: elements?.fire || 0, fullMark: 100 },
        { subject: '토(Earth)', A: elements?.earth || 0, fullMark: 100 },
        { subject: '금(Metal)', A: elements?.metal || 0, fullMark: 100 },
        { subject: '수(Water)', A: elements?.water || 0, fullMark: 100 },
    ], [elements]);

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex justify-center items-center p-4">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/85 backdrop-blur-md"
                />

                {/* Modal Window */}
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 220 }}
                    className="relative w-full max-w-[420px] max-h-[90vh] overflow-y-auto bg-[#0A0A0F] border border-white/10 rounded-[2rem] shadow-2xl z-10 flex flex-col no-scrollbar"
                >
                    {/* Close Button */}
                    <div className="absolute top-4 right-4 z-20">
                        <button
                            onClick={onClose}
                            className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-gray-500 hover:text-white transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* === 원본 RadarChartView 컨텐츠 그대로 재현 === */}
                    <section className="flex flex-col items-center justify-center relative py-8 px-4">

                        {/* Background Aura */}
                        <div className="absolute inset-0 pointer-events-none overflow-hidden">
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-primary-olive/5 rounded-full blur-[80px]" />
                        </div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8 }}
                            className="text-center w-full max-w-md z-10"
                        >
                            {/* Header (원본 그대로) */}
                            <div className="mb-6">
                                <span className="text-xs text-primary-olive font-bold tracking-widest uppercase border border-primary-olive/30 px-3 py-1 rounded-full bg-primary-olive/10">
                                    Part 1. Energy Balance
                                </span>
                                <h2 className="text-2xl md:text-3xl font-serif font-bold text-white mt-4 mb-2">나의 오행 에너지</h2>
                                <p className="text-sm text-gray-400">오행(Five Elements)의 균형을 분석합니다.</p>
                            </div>

                            {/* Radar Chart Container (원본 그대로) */}
                            <div className="h-[300px] md:h-[380px] w-full flex justify-center mb-6 relative px-2">
                                <ResponsiveContainer width="100%" height="100%">
                                    <RadarChart cx="50%" cy="50%" outerRadius="75%" data={chartData}>
                                        <PolarGrid stroke="#374151" strokeDasharray="3 3" />
                                        <PolarAngleAxis
                                            dataKey="subject"
                                            tick={(props: any) => <CustomTick {...props} />}
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

                            {/* Keywords Chips (원본 그대로) */}
                            <div className="flex flex-wrap justify-center gap-2 md:gap-3 px-4">
                                {(keywords || []).map((keyword: string, idx: number) => (
                                    <motion.span
                                        key={idx}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.3 + (idx * 0.1) }}
                                        className="px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-xs md:text-sm text-gray-300 backdrop-blur-sm shadow-sm hover:bg-primary-olive/20 transition-colors cursor-default"
                                    >
                                        #{keyword}
                                    </motion.span>
                                ))}
                            </div>

                            {/* Strength Report CTA Button (원본 그대로) */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.8 }}
                                className="mt-8"
                            >
                                <a
                                    href="/report/strength"
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500/20 to-amber-600/20 border border-amber-500/40 rounded-full text-amber-400 hover:from-amber-500/30 hover:to-amber-600/30 hover:border-amber-400/60 transition-all duration-300 shadow-lg shadow-amber-500/10 hover:shadow-amber-500/20"
                                >
                                    <span className="text-lg">✨</span>
                                    <span className="font-bold text-sm">상세 강점/재능 리포트 보기</span>
                                    <span className="text-xs bg-amber-500/30 px-2 py-0.5 rounded-full">NEW</span>
                                </a>
                            </motion.div>
                        </motion.div>
                    </section>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
