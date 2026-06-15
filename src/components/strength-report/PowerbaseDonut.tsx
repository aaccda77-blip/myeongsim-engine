'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { PowerbaseData, TeamRoleType, POWERBASE_COLORS, POWERBASE_LABELS } from '@/types/strength-report';
import { Crown } from 'lucide-react';

interface PowerbaseDonutProps {
    data: PowerbaseData;
    teamRole: TeamRoleType;
    teamRoleDescription: string;
    onItemClick?: (category: 'powerbase', itemKey: string, itemLabel: string, itemValue: number) => void;
}

// 팀 역할 한글 매핑
const TEAM_ROLE_KO: Record<TeamRoleType, string> = {
    'TEAM_SUPPORTER': '팀 서포터',
    'STRATEGIC_LEADER': '전략적 리더',
    'CREATIVE_INNOVATOR': '창의적 혁신가',
    'ANALYTICAL_EXPERT': '분석 전문가',
    'RELATIONSHIP_BUILDER': '관계 구축자',
    'EXECUTION_DRIVER': '실행 추진자',
};

// 커스텀 툴팁
const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
        const item = payload[0];
        return (
            <div className="bg-black/90 backdrop-blur-md border border-white/10 rounded-lg p-3 shadow-xl">
                <p className="text-white font-bold text-sm">{item.name}</p>
                <p className="text-gray-400 text-xs mt-1">
                    비율: <span className="text-white font-mono">{item.value.toFixed(0)}%</span>
                </p>
                <p className="text-[10px] text-amber-400/70 mt-1">👆 클릭하면 AI 상세 해설</p>
            </div>
        );
    }
    return null;
};

export default function PowerbaseDonut({ data, teamRole, teamRoleDescription, onItemClick }: PowerbaseDonutProps) {
    // 파이 차트 데이터 변환 (편차 확대 알고리즘 적용으로 기질 선호도를 역동적으로 시각화)
    const chartData = useMemo(() => {
        const values = Object.values(data);
        const minVal = Math.min(...values);
        const maxVal = Math.max(...values);
        
        // 격차를 확실히 표현하기 위해 최소값보다 약간 낮은 기준값을 빼줌
        const baseline = minVal - (maxVal - minVal > 5 ? 10 : 2);
        
        const adjustedWeights = (Object.entries(data) as [keyof PowerbaseData, number][]).map(([key, value]) => {
            const weight = Math.max(1, value - baseline);
            return { key, weight };
        });
        
        const totalWeight = adjustedWeights.reduce((sum, item) => sum + item.weight, 0);

        return (Object.entries(data) as [keyof PowerbaseData, number][])
            .map(([key, value]) => {
                const matchedWeight = adjustedWeights.find(item => item.key === key)?.weight || 1;
                const ratio = Math.round((matchedWeight / totalWeight) * 100);
                return {
                    name: POWERBASE_LABELS[key],
                    value: ratio, // 편차 보정 비율 (%)
                    rawValue: Math.round(value), // 100점 만점 실제 절대 점수
                    color: POWERBASE_COLORS[key],
                    key,
                };
            })
            .sort((a, b) => b.value - a.value);
    }, [data]);

    const topItem = chartData[0];

    // 파이 차트 클릭 핸들러 (실제 100점 만점 절대 점수를 전송하여 AI 해설의 정밀도 향상)
    const handlePieClick = (entry: any) => {
        if (!onItemClick || !entry) return;
        onItemClick('powerbase', entry.key, `조직 기여 기질: ${entry.name}`, entry.rawValue);
    };

    return (
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
            {/* Header */}
            <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-2">
                🍩 조직 기여 에너지 (파워베이스)
            </h3>
            <p className="text-xs text-gray-400 mb-4">(내가 조직 내에서 주로 발휘하는 힘의 원천)</p>

            <div className="flex flex-col md:flex-row items-center gap-6">
                {/* Donut Chart */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8 }}
                    className="w-[180px] h-[180px] relative"
                >
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={chartData}
                                cx="50%"
                                cy="50%"
                                innerRadius={55}
                                outerRadius={80}
                                paddingAngle={2}
                                dataKey="value"
                                isAnimationActive={true}
                                animationDuration={1200}
                                animationEasing="ease-out"
                                onClick={handlePieClick}
                                style={{ cursor: 'pointer' }}
                            >
                                {chartData.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={entry.color}
                                        stroke="transparent"
                                    />
                                ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                        </PieChart>
                    </ResponsiveContainer>

                    {/* Center Label */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <span className="text-xl font-bold text-white">{topItem.value}%</span>
                        <span className="text-amber-400 font-mono text-[11px] font-bold">({topItem.rawValue}점)</span>
                        <span className="text-[9px] text-gray-400 text-center px-2 leading-tight mt-0.5">
                            {topItem.name.split(' ')[0]}
                        </span>
                    </div>
                </motion.div>

                {/* Legend */}
                <div className="flex-1 space-y-2">
                    {chartData.map((item, idx) => (
                        <motion.div
                            key={item.key}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5 + idx * 0.1 }}
                            className="flex items-center gap-2 cursor-pointer hover:bg-white/5 rounded-lg px-2 py-1 -mx-2 transition-colors"
                            onClick={() => onItemClick?.('powerbase', item.key, `조직 기여 기질: ${item.name}`, item.rawValue)}
                        >
                            <span
                                className="w-3 h-3 rounded-sm shrink-0"
                                style={{ backgroundColor: item.color }}
                            />
                            <span className="text-xs text-white font-mono w-16 text-right shrink-0 mr-1">
                                {item.value}% ({item.rawValue}점)
                            </span>
                            <span className="text-xs text-gray-300 truncate">{item.name}</span>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Team Role Badge */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="mt-6 pt-4 border-t border-white/10"
            >
                <div
                    className="flex items-center gap-3 bg-gradient-to-r from-amber-500/10 to-transparent rounded-xl p-4 border border-amber-500/20 cursor-pointer hover:border-amber-500/40 transition-colors"
                    onClick={() => onItemClick?.('powerbase', 'teamRole', `팀 역할: ${TEAM_ROLE_KO[teamRole]}`, 85)}
                >
                    <div className="w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center shrink-0">
                        <Crown className="w-6 h-6 text-amber-400" />
                    </div>
                    <div>
                        <p className="text-xs text-gray-400 uppercase tracking-wider">조직 내 나의 역할</p>
                        <p className="text-lg font-bold text-amber-400">{TEAM_ROLE_KO[teamRole]}</p>
                        <p className="text-xs text-gray-300 mt-0.5">{teamRoleDescription}</p>
                    </div>
                </div>
            </motion.div>

            {/* Footnote */}
            <p className="text-[10px] text-gray-600 mt-4">
                * 각 항목을 클릭하면 AI가 상세히 분석해드립니다.
            </p>
        </div>
    );
}
