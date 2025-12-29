'use client';

import { useReportStore } from '@/store/useReportStore';
import { motion } from 'framer-motion';
import { Feather, Leaf, Flame, Mountain, Droplets, Swords, Sparkles, Wind } from 'lucide-react';
import { useMemo } from 'react';

// [Deep Tech Logic] 오행별 비주얼 테마 매핑
const ELEMENT_THEMES: Record<string, { icon: any; gradient: string; shadow: string; color: string }> = {
    Wood: {
        icon: <Wind className="w-20 h-20" />,
        gradient: 'from-green-900 to-emerald-500/30',
        shadow: 'shadow-emerald-500/20',
        color: 'text-emerald-400'
    },
    Fire: {
        icon: <Flame className="w-20 h-20" />,
        gradient: 'from-red-900 to-orange-500/30',
        shadow: 'shadow-orange-500/20',
        color: 'text-orange-400'
    },
    Earth: {
        icon: <Mountain className="w-20 h-20" />,
        gradient: 'from-yellow-900 to-amber-500/30',
        shadow: 'shadow-amber-500/20',
        color: 'text-amber-400'
    },
    Metal: {
        icon: <Swords className="w-20 h-20" />,
        gradient: 'from-gray-800 to-gray-300/30',
        shadow: 'shadow-gray-400/20',
        color: 'text-gray-300'
    },
    Water: {
        icon: <Droplets className="w-20 h-20" />,
        gradient: 'from-blue-900 to-cyan-500/30',
        shadow: 'shadow-cyan-500/20',
        color: 'text-cyan-400'
    },
    Unknown: {
        icon: <Sparkles className="w-20 h-20" />,
        gradient: 'from-gray-900 to-white/10',
        shadow: 'shadow-white/10',
        color: 'text-gray-400'
    }
};

// 헬퍼: 일간 텍스트에서 오행 추출 ('갑(Wood)' -> 'Wood')
const getElementFromDayMaster = (dayMaster: string = '') => {
    if (dayMaster.includes('Wood') || dayMaster.includes('목') || dayMaster.includes('갑') || dayMaster.includes('을')) return 'Wood';
    if (dayMaster.includes('Fire') || dayMaster.includes('화') || dayMaster.includes('병') || dayMaster.includes('정')) return 'Fire';
    if (dayMaster.includes('Earth') || dayMaster.includes('토') || dayMaster.includes('무') || dayMaster.includes('기')) return 'Earth';
    if (dayMaster.includes('Metal') || dayMaster.includes('금') || dayMaster.includes('경') || dayMaster.includes('신')) return 'Metal';
    if (dayMaster.includes('Water') || dayMaster.includes('수') || dayMaster.includes('임') || dayMaster.includes('계')) return 'Water';
    return 'Unknown';
};

export default function IdentityView() {
    const { reportData } = useReportStore();

    // Data Guard
    if (!reportData || !reportData.saju) return null;

    const { dayMaster, dayMasterTrait, keywords } = reportData.saju;

    // [Fix 1] Dynamic Visual Logic
    const elementTheme = useMemo(() => {
        const element = getElementFromDayMaster(dayMaster);
        return ELEMENT_THEMES[element] || ELEMENT_THEMES.Unknown;
    }, [dayMaster]);

    return (
        <div className="h-full flex flex-col pt-6 pb-8 px-4 overflow-y-auto scrollbar-hide">

            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8 text-center shrink-0"
            >
                <span className="text-primary-olive text-[10px] font-bold tracking-widest uppercase border border-primary-olive/30 px-3 py-1 rounded-full bg-primary-olive/10">
                    03. My Essence
                </span>
                <h2 className="text-2xl font-serif text-white mt-4">나의 본질 (Day Master)</h2>
                <p className="text-gray-400 text-xs mt-2">당신을 지배하는 가장 강력한 에너지입니다.</p>
            </motion.div>

            <div className="flex-1 flex flex-col items-center justify-start min-h-0">

                {/* [Fix 2] Dynamic 3D Orb Visual */}
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.8, type: 'spring' }}
                    className={`w-48 h-48 md:w-56 md:h-56 rounded-full bg-gradient-to-tr ${elementTheme.gradient} flex items-center justify-center mb-8 relative shadow-[0_0_60px_-10px] ${elementTheme.shadow} backdrop-blur-xl`}
                >
                    {/* Rotating Rings */}
                    <div className={`absolute inset-0 border border-white/20 rounded-full animate-[spin_20s_linear_infinite]`} />
                    <div className={`absolute inset-4 border border-white/10 rounded-full animate-[spin_15s_linear_infinite_reverse]`} />

                    {/* Center Icon with Glow */}
                    <div className={`${elementTheme.color} drop-shadow-[0_0_15px_rgba(255,255,255,0.3)] filter`}>
                        {elementTheme.icon}
                    </div>

                    {/* Orbiting Particle */}
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-[-10px] rounded-full"
                    >
                        <div className={`w-3 h-3 rounded-full bg-white shadow-[0_0_10px_#fff] absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2`} />
                    </motion.div>
                </motion.div>

                {/* Main Text Content */}
                <div className="text-center mb-8 max-w-sm">
                    <motion.h3
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="text-2xl md:text-3xl font-serif text-white mb-3"
                    >
                        {dayMasterTrait}
                    </motion.h3>

                    <div className={`inline-block px-4 py-1.5 rounded-full bg-white/5 border border-white/10 ${elementTheme.color} font-bold text-sm mb-6`}>
                        {dayMaster}
                    </div>
                </div>

                {/* Keywords Grid (Safe Mapping) */}
                <div className="grid grid-cols-3 gap-3 w-full max-w-md">
                    {(keywords || []).map((keyword, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.5 + (idx * 0.1) }}
                            className="bg-deep-slate border border-white/10 rounded-xl p-3 flex flex-col items-center justify-center gap-2 shadow-lg hover:border-primary-olive/40 transition-colors aspect-[4/3]"
                        >
                            <Feather className="w-4 h-4 text-gray-500" />
                            <span className="text-xs md:text-sm text-gray-200 font-medium break-keep text-center">{keyword}</span>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
