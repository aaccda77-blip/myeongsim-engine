'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { TalentProfileData } from '@/types/strength-report';
import { Zap, Users, Target, Wrench, Search, Flame } from 'lucide-react';

interface TalentProfileBarsProps {
    data: TalentProfileData;
}

const TALENT_CONFIG = [
    {
        key: 'transformation' as const,
        label: 'TRANSFORMATION / 변혁 지향',
        icon: Flame,
        color: 'from-red-500 to-orange-500',
        shadow: 'shadow-red-500/30'
    },
    {
        key: 'dissemination' as const,
        label: 'DISSEMINATION / 전파 지향',
        icon: Users,
        color: 'from-amber-500 to-yellow-500',
        shadow: 'shadow-amber-500/30'
    },
    {
        key: 'contact' as const,
        label: 'CONTACT / 고객 지향',
        icon: Target,
        color: 'from-emerald-500 to-green-500',
        shadow: 'shadow-emerald-500/30'
    },
    {
        key: 'realization' as const,
        label: 'REALIZATION / 행동 지향',
        icon: Zap,
        color: 'from-blue-500 to-cyan-500',
        shadow: 'shadow-blue-500/30'
    },
    {
        key: 'development' as const,
        label: 'DEVELOPMENT / 상품 지향',
        icon: Wrench,
        color: 'from-purple-500 to-indigo-500',
        shadow: 'shadow-purple-500/30'
    },
    {
        key: 'analysis' as const,
        label: 'ANALYSIS / 자원 지향',
        icon: Search,
        color: 'from-gray-400 to-gray-500',
        shadow: 'shadow-gray-500/30'
    },
];

export default function TalentProfileBars({ data }: TalentProfileBarsProps) {
    // 정렬된 데이터 (높은 순)
    const sortedData = [...TALENT_CONFIG].sort((a, b) => data[b.key] - data[a.key]);

    return (
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
            {/* Header */}
            <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-2">
                📊 업무 성향 프로필
            </h3>
            <p className="text-xs text-gray-400 mb-6">나의 업무 스타일과 선호하는 역할을 보여줍니다</p>

            {/* Bars */}
            <div className="space-y-4">
                {sortedData.map((config, idx) => {
                    const value = data[config.key];
                    const Icon = config.icon;

                    return (
                        <motion.div
                            key={config.key}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1 }}
                        >
                            {/* Label Row */}
                            <div className="flex justify-between items-center mb-1.5">
                                <div className="flex items-center gap-2">
                                    <Icon className="w-3.5 h-3.5 text-gray-500" />
                                    <span className="text-xs text-gray-300 font-medium">{config.label}</span>
                                </div>
                                <span className="text-xs font-mono text-white bg-white/10 px-2 py-0.5 rounded">
                                    {value.toFixed(0)}
                                </span>
                            </div>

                            {/* Progress Bar */}
                            <div className="h-2.5 w-full bg-black/40 rounded-full overflow-hidden border border-white/5">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${value}%` }}
                                    transition={{ duration: 1, delay: 0.2 + idx * 0.1, ease: "easeOut" }}
                                    className={`h-full rounded-full bg-gradient-to-r ${config.color} relative`}
                                >
                                    {/* Glow Effect */}
                                    <div className="absolute right-0 top-0 bottom-0 w-2 bg-white/50 blur-[2px]" />
                                </motion.div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* Insight */}
            <div className="mt-6 pt-4 border-t border-white/10">
                <p className="text-xs text-gray-400">
                    💡 가장 높은 역량: <span className="text-white font-bold">{sortedData[0].label.split(' / ')[1]}</span> -
                    이 영역에서 당신의 천재성이 발휘됩니다.
                </p>
            </div>
        </div>
    );
}
