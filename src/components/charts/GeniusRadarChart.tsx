'use client';

import { motion } from 'framer-motion';
import { useMemo } from 'react';
import { PolarAngleAxis, PolarGrid, Radar, RadarChart, ResponsiveContainer, Tooltip } from 'recharts';

/**
 * GeniusRadarChart - 8축 천재성 레이더 차트
 * 
 * 용도: 성격분석 메뉴 상단에 배치하여 사용자의 고유 에너지 프로파일을 시각화
 * 디자인: 다크 배경 + 네온 그린/골드 라인 (사이버펑크 스타일)
 */

interface GeniusRadarProps {
    scores?: {
        creativity?: number;     // 창의성
        logic?: number;          // 논리력
        empathy?: number;        // 공감력
        leadership?: number;     // 리더십
        resilience?: number;     // 회복력
        intuition?: number;      // 직관력
        communication?: number;  // 소통력
        execution?: number;      // 실행력
    };
    compact?: boolean;
}

// 기본값 (데이터 없을 때 사용)
const DEFAULT_SCORES = {
    creativity: 75,
    logic: 65,
    empathy: 80,
    leadership: 70,
    resilience: 85,
    intuition: 90,
    communication: 60,
    execution: 72,
};

// 커스텀 툴팁
const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
        const data = payload[0];
        return (
            <div className="bg-deep-slate/95 border border-neon-green/30 p-3 rounded-lg shadow-2xl backdrop-blur-md">
                <p className="text-neon-green font-bold text-xs mb-1 tracking-widest uppercase">Energy Score</p>
                <p className="text-white text-sm">
                    {data.payload.subject}: <span className="font-mono font-bold text-neon-green ml-1">{data.value}</span>
                    <span className="text-gray-500 text-xs ml-0.5">/100</span>
                </p>
            </div>
        );
    }
    return null;
};

export default function GeniusRadarChart({ scores = DEFAULT_SCORES, compact = false }: GeniusRadarProps) {
    // 차트 데이터 변환
    const chartData = useMemo(() => [
        { subject: '창의성', A: scores.creativity || 0, fullMark: 100 },
        { subject: '논리력', A: scores.logic || 0, fullMark: 100 },
        { subject: '공감력', A: scores.empathy || 0, fullMark: 100 },
        { subject: '리더십', A: scores.leadership || 0, fullMark: 100 },
        { subject: '회복력', A: scores.resilience || 0, fullMark: 100 },
        { subject: '직관력', A: scores.intuition || 0, fullMark: 100 },
        { subject: '소통력', A: scores.communication || 0, fullMark: 100 },
        { subject: '실행력', A: scores.execution || 0, fullMark: 100 },
    ], [scores]);

    const height = compact ? 200 : 280;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="w-full relative"
        >
            {/* 배경 글로우 효과 */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] bg-emerald-500/10 rounded-full blur-[60px]" />
            </div>

            {/* 레이더 차트 */}
            <div style={{ height }} className="w-full relative z-10">
                <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
                        <PolarGrid stroke="#374151" strokeDasharray="3 3" />
                        <PolarAngleAxis
                            dataKey="subject"
                            tick={{ fill: '#9CA3AF', fontSize: compact ? 9 : 11, fontWeight: 500 }}
                        />
                        <Radar
                            name="Genius Profile"
                            dataKey="A"
                            stroke="#10B981"
                            strokeWidth={2}
                            fill="#10B981"
                            fillOpacity={0.3}
                            isAnimationActive={true}
                            animationDuration={1200}
                            animationEasing="ease-out"
                            style={{
                                filter: 'drop-shadow(0 0 8px rgba(16, 185, 129, 0.5))'
                            }}
                        />
                        {!compact && <Tooltip content={<CustomTooltip />} cursor={false} />}
                    </RadarChart>
                </ResponsiveContainer>
            </div>

            {/* 하단 요약 텍스트 */}
            {!compact && (
                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="text-center text-gray-400 text-xs mt-2"
                >
                    당신만의 고유한 에너지 프로파일입니다
                </motion.p>
            )}
        </motion.div>
    );
}
