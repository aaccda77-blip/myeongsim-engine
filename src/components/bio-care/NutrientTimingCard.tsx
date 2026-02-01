/**
 * /components/bio-care/NutrientTimingCard.tsx
 * 시간대별 영양제 카드
 */

'use client';

import React from 'react';
import { Supplement, TimingCategory, TIMING_INFO } from '@/data/NutrientTimingDB';
import { motion } from 'framer-motion';

interface NutrientTimingCardProps {
    timing: TimingCategory;
    supplements: Array<{ supplement: Supplement; userTiming: TimingCategory }>;
    onRemove: (supplementId: string) => void;
}

export default function NutrientTimingCard({ timing, supplements, onRemove }: NutrientTimingCardProps) {
    const timingInfo = TIMING_INFO[timing];
    const filteredSupplements = supplements.filter(s => s.userTiming === timing);

    const getColorClasses = (color: string) => {
        switch (color) {
            case 'amber':
                return {
                    bg: 'from-amber-500/10 to-yellow-500/10',
                    border: 'border-amber-500/30',
                    text: 'text-amber-400',
                    icon: 'text-amber-400'
                };
            case 'green':
                return {
                    bg: 'from-green-500/10 to-emerald-500/10',
                    border: 'border-green-500/30',
                    text: 'text-green-400',
                    icon: 'text-green-400'
                };
            case 'indigo':
                return {
                    bg: 'from-indigo-500/10 to-purple-500/10',
                    border: 'border-indigo-500/30',
                    text: 'text-indigo-400',
                    icon: 'text-indigo-400'
                };
            default:
                return {
                    bg: 'from-gray-500/10 to-gray-500/10',
                    border: 'border-gray-500/30',
                    text: 'text-gray-400',
                    icon: 'text-gray-400'
                };
        }
    };

    const colors = getColorClasses(timingInfo.color);

    return (
        <div className={`bg-gradient-to-r ${colors.bg} border ${colors.border} rounded-2xl p-5`}>
            <div className="flex items-center gap-3 mb-4">
                <span className={`material-symbols-outlined ${colors.icon} text-2xl`}>
                    {timingInfo.icon}
                </span>
                <div className="flex-1">
                    <h3 className={`${colors.text} font-bold text-lg`}>{timingInfo.label}</h3>
                    <p className="text-gray-400 text-xs">{timingInfo.time}</p>
                </div>
            </div>

            <p className="text-gray-300 text-sm mb-4">{timingInfo.description}</p>

            {filteredSupplements.length === 0 ? (
                <div className="text-center py-6 text-gray-500 text-sm">
                    등록된 영양제가 없습니다
                </div>
            ) : (
                <div className="space-y-2">
                    {filteredSupplements.map(({ supplement, userTiming }) => {
                        const isOptimal = supplement.optimalTiming === userTiming;
                        return (
                            <motion.div
                                key={supplement.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`p-3 rounded-xl ${isOptimal
                                        ? 'bg-white/10 border border-white/20'
                                        : 'bg-yellow-500/10 border border-yellow-500/30'
                                    }`}
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h4 className="text-white font-bold text-sm">
                                                {supplement.name}
                                            </h4>
                                            {isOptimal ? (
                                                <span className="text-xs bg-green-500/20 text-green-300 px-2 py-0.5 rounded-full">
                                                    ✓ 최적
                                                </span>
                                            ) : (
                                                <span className="text-xs bg-yellow-500/20 text-yellow-300 px-2 py-0.5 rounded-full">
                                                    ⚠️ 권장 시간 아님
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-gray-400 text-xs leading-relaxed">
                                            {supplement.description}
                                        </p>
                                        {!isOptimal && (
                                            <p className="text-yellow-300 text-xs mt-2">
                                                💡 {supplement.reason}
                                            </p>
                                        )}
                                    </div>
                                    <button
                                        onClick={() => onRemove(supplement.id)}
                                        className="text-gray-500 hover:text-red-400 transition-colors ml-2"
                                    >
                                        <span className="material-symbols-outlined text-sm">delete</span>
                                    </button>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
