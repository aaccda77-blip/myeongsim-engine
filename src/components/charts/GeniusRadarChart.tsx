'use client';

import { motion } from 'framer-motion';
import { useMemo } from 'react';
import { PolarAngleAxis, PolarGrid, Radar, RadarChart, ResponsiveContainer, Tooltip } from 'recharts';
import {
    SajuMatrix,
    ScoreCalculator,
    generateDefaultScores,
    convertOhaengToRadar,
    OhaengScores
} from '@/utils/ScoreCalculator';

/**
 * GeniusRadarChart - 8축 천재성 레이더 차트
 * 
 * 용도: 성격분석 메뉴 상단에 배치하여 사용자의 고유 에너지 프로파일을 시각화
 * 디자인: 다크 배경 + 네온 그린/골드 라인 (사이버펑크 스타일)
 * 데이터: ScoreCalculator를 통해 사주/진키 데이터를 점수로 변환
 */

interface GeniusRadarProps {
    /** 직접 점수 입력 (우선순위 1) */
    scores?: {
        creativity?: number;
        logic?: number;
        empathy?: number;
        leadership?: number;
        resilience?: number;
        intuition?: number;
        communication?: number;
        execution?: number;
    };
    /** 사주 매트릭스 입력 (우선순위 2) - ScoreCalculator로 변환 */
    sajuMatrix?: SajuMatrix;
    /** 진키 코드 목록 */
    myCodes?: number[];
    /** 오행 점수만 입력 (우선순위 3) */
    ohaeng?: OhaengScores;
    /** 컴팩트 모드 */
    compact?: boolean;
}

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

export default function GeniusRadarChart({
    scores,
    sajuMatrix,
    myCodes = [],
    ohaeng,
    compact = false
}: GeniusRadarProps) {
    // 점수 계산 (우선순위: scores > sajuMatrix > ohaeng > default)
    const computedScores = useMemo(() => {
        // 1. 직접 입력된 점수가 있으면 사용
        if (scores && Object.keys(scores).length > 0) {
            return {
                creativity: scores.creativity || 70,
                logic: scores.logic || 65,
                empathy: scores.empathy || 75,
                leadership: scores.leadership || 70,
                resilience: scores.resilience || 80,
                intuition: scores.intuition || 85,
                communication: scores.communication || 60,
                execution: scores.execution || 72,
            };
        }

        // 2. 사주 매트릭스가 있으면 ScoreCalculator 사용
        if (sajuMatrix) {
            const calculator = new ScoreCalculator(sajuMatrix, myCodes);
            return calculator.toChartFormat();
        }

        // 3. 오행 점수만 있으면 변환
        if (ohaeng) {
            const radarScores = convertOhaengToRadar(ohaeng);
            return {
                creativity: radarScores.expression,
                logic: radarScores.mental,
                empathy: radarScores.feeling,
                leadership: radarScores.drive,
                resilience: radarScores.stability,
                intuition: radarScores.intuition,
                communication: radarScores.expression,
                execution: radarScores.activity,
            };
        }

        // 4. 기본값 (데모용)
        const defaultScores = generateDefaultScores();
        return {
            creativity: defaultScores.expression,
            logic: defaultScores.mental,
            empathy: defaultScores.feeling,
            leadership: defaultScores.drive,
            resilience: defaultScores.stability,
            intuition: defaultScores.intuition,
            communication: defaultScores.expression,
            execution: defaultScores.activity,
        };
    }, [scores, sajuMatrix, myCodes, ohaeng]);

    // 차트 데이터 변환
    const chartData = useMemo(() => [
        { subject: '창의성', A: computedScores.creativity, fullMark: 100 },
        { subject: '논리력', A: computedScores.logic, fullMark: 100 },
        { subject: '공감력', A: computedScores.empathy, fullMark: 100 },
        { subject: '리더십', A: computedScores.leadership, fullMark: 100 },
        { subject: '회복력', A: computedScores.resilience, fullMark: 100 },
        { subject: '직관력', A: computedScores.intuition, fullMark: 100 },
        { subject: '소통력', A: computedScores.communication, fullMark: 100 },
        { subject: '실행력', A: computedScores.execution, fullMark: 100 },
    ], [computedScores]);

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
