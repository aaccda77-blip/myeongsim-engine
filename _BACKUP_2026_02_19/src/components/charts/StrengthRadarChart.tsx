
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

/**
 * StrengthRadarChart - 8축 강점/본질 에너지 레이더 차트 (v2.0 Enhanced)
 * 
 * 변경사항 (Expert Feedback):
 * 1. 비교군 (Average) 추가: 회색 다각형 배경
 * 2. 수치 명시: 라벨 옆에 점수 표시
 * 3. One-line Insight: "당신의 강점은 X입니다"
 */

interface StrengthRadarProps {
    scores?: Record<string, number>;
    sajuMatrix?: SajuMatrix;
    myCodes?: number[];
    ohaeng?: OhaengScores;
    compact?: boolean;
    onTraitClick?: (trait: string, score: number) => void;
}

const MYEONGSIM_LABELS: Record<string, string> = {
    creativity: "표현",
    logic: "구조",
    empathy: "연결",
    leadership: "추진",
    resilience: "기반",
    intuition: "통찰",
    communication: "소통",
    execution: "실행",
};

// Custom Tick Component for Labels + Scores
const CustomTick = ({ payload, x, y, textAnchor, stroke, radius, scores }: any) => {
    // Find score for this label
    const key = Object.keys(MYEONGSIM_LABELS).find(k => MYEONGSIM_LABELS[k] === payload.value);
    const score = key ? scores[key] : 0;

    return (
        <g className="recharts-layer recharts-polar-angle-axis-tick">
            <text
                x={x}
                y={y}
                textAnchor={textAnchor}
                fill="#9CA3AF"
                fontSize={10}
                fontWeight="bold"
            >
                <tspan x={x} dy="0em">{payload.value}</tspan>
                <tspan x={x} dy="1.2em" fill={score > 80 ? '#10B981' : '#6B7280'} fontSize={9}>
                    {score}
                </tspan>
            </text>
        </g>
    );
};

export default function StrengthRadarChart({
    scores,
    sajuMatrix,
    myCodes = [],
    ohaeng,
    compact = false,
    onTraitClick
}: StrengthRadarProps) {
    const computedScores = useMemo(() => {
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

    const chartData = useMemo(() => [
        { subject: MYEONGSIM_LABELS.creativity, originalKey: 'creativity', A: computedScores.creativity, B: 55, fullMark: 100 },
        { subject: MYEONGSIM_LABELS.logic, originalKey: 'logic', A: computedScores.logic, B: 60, fullMark: 100 },
        { subject: MYEONGSIM_LABELS.empathy, originalKey: 'empathy', A: computedScores.empathy, B: 50, fullMark: 100 },
        { subject: MYEONGSIM_LABELS.leadership, originalKey: 'leadership', A: computedScores.leadership, B: 55, fullMark: 100 },
        { subject: MYEONGSIM_LABELS.resilience, originalKey: 'resilience', A: computedScores.resilience, B: 60, fullMark: 100 },
        { subject: MYEONGSIM_LABELS.intuition, originalKey: 'intuition', A: computedScores.intuition, B: 45, fullMark: 100 },
        { subject: MYEONGSIM_LABELS.communication, originalKey: 'communication', A: computedScores.communication, B: 55, fullMark: 100 },
        { subject: MYEONGSIM_LABELS.execution, originalKey: 'execution', A: computedScores.execution, B: 50, fullMark: 100 },
    ], [computedScores]);

    // Find Max Trait
    const maxTrait = useMemo(() => {
        let maxKey = '';
        let maxVal = -1;
        Object.entries(computedScores).forEach(([k, v]) => {
            if (v > maxVal) { maxVal = v; maxKey = k; }
        });
        return { label: MYEONGSIM_LABELS[maxKey], val: maxVal };
    }, [computedScores]);

    const height = compact ? 220 : 300; // Little taller for labels

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="w-full relative"
        >
            <div style={{ height, minHeight: 220 }} className="w-full relative z-10">
                <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius={compact ? "60%" : "65%"} data={chartData}>
                        <PolarGrid stroke="#374151" strokeDasharray="3 3" />
                        <PolarAngleAxis
                            dataKey="subject"
                            tick={(props) => <CustomTick {...props} scores={computedScores} />}
                        />
                        {/* Average (Comparison) */}
                        <Radar
                            name="Average"
                            dataKey="B" // Mock Average (50-60 range)
                            stroke="#4B5563"
                            strokeWidth={1}
                            fill="#6B7280"
                            fillOpacity={0.1}
                        />
                        {/* User Data */}
                        <Radar
                            name="My Energy"
                            dataKey="A"
                            stroke="#10B981"
                            strokeWidth={2}
                            fill="#10B981"
                            fillOpacity={0.4}
                            isAnimationActive={true}
                            animationDuration={1500}
                        />
                        {!compact && <Tooltip />}
                    </RadarChart>
                </ResponsiveContainer>
            </div>

            {/* One-Line Insight */}
            <div className="text-center -mt-2 pb-2">
                <p className="text-white text-xs font-medium">
                    당신의 가장 큰 무기는 <span className="text-neon-green font-bold text-sm">'{maxTrait.label}'</span>입니다 ✨
                </p>
                {!compact && (
                    <p className="text-gray-500 text-[10px] mt-1">상위 1% 잠재력을 가지고 있습니다.</p>
                )}
            </div>
        </motion.div>
    );
}
