'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Lightbulb, Heart, Zap } from 'lucide-react';

interface SpecificTalentCardsProps {
    talents: string[];
}

// 카드별 아이콘과 색상
const CARD_STYLES = [
    {
        icon: Sparkles,
        gradient: 'from-purple-500/20 to-pink-500/20',
        border: 'border-purple-500/30',
        iconColor: 'text-purple-400'
    },
    {
        icon: Lightbulb,
        gradient: 'from-amber-500/20 to-orange-500/20',
        border: 'border-amber-500/30',
        iconColor: 'text-amber-400'
    },
    {
        icon: Heart,
        gradient: 'from-rose-500/20 to-red-500/20',
        border: 'border-rose-500/30',
        iconColor: 'text-rose-400'
    },
    {
        icon: Zap,
        gradient: 'from-emerald-500/20 to-teal-500/20',
        border: 'border-emerald-500/30',
        iconColor: 'text-emerald-400'
    },
];

export default function SpecificTalentCards({ talents }: SpecificTalentCardsProps) {
    return (
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
            {/* Header */}
            <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-2">
                ✨ MY SPECIFIC TALENTS AND SKILLS
            </h3>
            <p className="text-xs text-gray-400 mb-6">당신만의 구체적인 재능과 기술입니다</p>

            {/* Cards Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {talents.slice(0, 4).map((talent, idx) => {
                    const style = CARD_STYLES[idx % CARD_STYLES.length];
                    const Icon = style.icon;

                    return (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ delay: idx * 0.15 }}
                            whileHover={{ scale: 1.03, y: -3 }}
                            className={`
                                relative overflow-hidden rounded-xl p-4 
                                bg-gradient-to-br ${style.gradient}
                                border ${style.border}
                                backdrop-blur-md
                                cursor-default
                                transition-shadow duration-300
                                hover:shadow-lg hover:shadow-white/5
                            `}
                        >
                            {/* Decorative Circle */}
                            <div className="absolute -top-4 -right-4 w-16 h-16 bg-white/5 rounded-full blur-xl" />

                            {/* Icon */}
                            <div className={`w-10 h-10 rounded-full bg-black/30 flex items-center justify-center mb-3 ${style.iconColor}`}>
                                <Icon className="w-5 h-5" />
                            </div>

                            {/* Arrow bullet */}
                            <div className="flex items-start gap-2">
                                <span className="text-gray-500 text-sm mt-0.5">›</span>
                                <p className="text-sm text-white font-medium leading-tight">
                                    {talent}
                                </p>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* Bottom Note */}
            <p className="text-center text-xs text-gray-500 mt-6">
                이 재능들은 당신이 타고난 강점입니다. 의식적으로 활용할 때 더 빛납니다.
            </p>
        </div>
    );
}
