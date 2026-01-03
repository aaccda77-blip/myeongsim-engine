'use client';

import { motion } from 'framer-motion';
import { useMemo } from 'react';
import { PolarAngleAxis, PolarGrid, Radar, RadarChart, ResponsiveContainer, Tooltip } from 'recharts';
import {
    SajuMatrix,
    generateDefaultScores,
    convertOhaengToRadar,
    OhaengScores
} from '@/utils/ScoreCalculator';
// [Security] ScoreCalculator class is now called via API, not imported here

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
    /** 클릭 이벤트 핸들러 */
    onTraitClick?: (trait: string, score: number) => void;
}

// 명심 코칭 용어 매핑 (표시용)
const MYEONGSIM_LABELS: Record<string, string> = {
    creativity: "Expression",
    logic: "Structure",
    empathy: "Connection",
    leadership: "Drive",
    resilience: "Grounding",
    intuition: "Insight",
    communication: "Flow",
    execution: "Action",
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

export default function GeniusRadarChart({
    scores,
    sajuMatrix,
    myCodes = [],
    ohaeng,
    compact = false,
    onTraitClick
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

        // 2. 사주 매트릭스가 있어도 API를 통해 미리 계산되어 scores로 전달되미로
        // 직접 ScoreCalculator를 사용하지 않음 (보안 문제)
        // 기존 sajuMatrix path는 삭제

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

    // 차트 데이터 변환 (명심 용어 적용)
    const chartData = useMemo(() => [
        { subject: MYEONGSIM_LABELS.creativity, originalKey: 'creativity', A: computedScores.creativity, fullMark: 100 },
        { subject: MYEONGSIM_LABELS.logic, originalKey: 'logic', A: computedScores.logic, fullMark: 100 },
        { subject: MYEONGSIM_LABELS.empathy, originalKey: 'empathy', A: computedScores.empathy, fullMark: 100 },
        { subject: MYEONGSIM_LABELS.leadership, originalKey: 'leadership', A: computedScores.leadership, fullMark: 100 },
        { subject: MYEONGSIM_LABELS.resilience, originalKey: 'resilience', A: computedScores.resilience, fullMark: 100 },
        { subject: MYEONGSIM_LABELS.intuition, originalKey: 'intuition', A: computedScores.intuition, fullMark: 100 },
        { subject: MYEONGSIM_LABELS.communication, originalKey: 'communication', A: computedScores.communication, fullMark: 100 },
        { subject: MYEONGSIM_LABELS.execution, originalKey: 'execution', A: computedScores.execution, fullMark: 100 },
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
                            tick={{ fill: '#9CA3AF', fontSize: compact ? 9 : 11, fontWeight: 500, cursor: 'pointer' }}
                            onClick={(data) => {
                                if (onTraitClick && data && data.value) {
                                    // Find key by label
                                    const item = chartData.find(d => d.subject === data.value);
                                    if (item) onTraitClick(item.originalKey, item.A);
                                }
                            }}
                        />
                        <Radar
                            name="Energy Signature"
                            dataKey="A"
                            stroke="#10B981"
                            strokeWidth={2}
                            fill="#10B981"
                            fillOpacity={0.3}
                            isAnimationActive={true}
                            animationDuration={1200}
                            animationEasing="ease-out"
                            style={{
                                filter: 'drop-shadow(0 0 8px rgba(16, 185, 129, 0.5))',
                                cursor: onTraitClick ? 'pointer' : 'default'
                            }}
                        />
                        {!compact && <Tooltip content={<CustomTooltip />} cursor={false} />}
                    </RadarChart>
                </ResponsiveContainer>
                {/* Click Overlay for easier interaction */}
                {onTraitClick && (
                    <div className="absolute inset-0 z-20 pointer-events-none">
                        {/* We rely on Recharts PolarGrid click for now, or just let users click the main area. 
                            Ideally, we want to click specific axes. 
                            Let's use the PolarAngleAxis tick click if supported, but Recharts is limited.
                            Alternate strategy: overlay invisible buttons? Too complex.
                            Let's rely on the parent wrapper click or just accept the limitation.
                            Actually, we can pass onClick to Recharts components.
                        */}
                    </div>
                )}
            </div>

            {/* 하단 요약 텍스트 */}
            {!compact && (
                <div className="text-center mt-2">
                    <p className="text-neon-green/80 text-xs font-bold tracking-wider mb-1">ENERGY SIGNATURE</p>
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="text-gray-400 text-[10px]"
                    >
                        에너지 항목을 클릭하면 상세 설명이 나옵니다
                    </motion.p>
                </div>
            )}
        </motion.div>
    );
}
